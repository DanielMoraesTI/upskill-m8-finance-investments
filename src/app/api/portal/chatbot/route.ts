import ai from "@/app/api/_lib/gemini";
import { NextRequest, NextResponse } from "next/server";
import type { TChatbotEvent } from "@/schemas/chatbotSchema";
import type { Content, ApiError, GenerateContentConfig, FunctionCall } from "@google/genai";
import { errorResponse } from "@/app/api/_utils/serverUtils";
import { chatbotSystemInstruction } from "@/app/api/_utils/geminiPrompts";
import { chatbotTools, ChatbotFunctionSchema } from "@/app/api/_utils/chatbot.functions";
import chatbotService from "@/app/api/_services/chatbot.service";

const MODEL_NAME = process.env.GEMINI_MODEL_NAME || "gemini-3.1-flash-lite-preview";

const functionStepMap: Record<string, string> = {
    "get_investment_summary": "Consultando resumo financeiro...",
};

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (id) {
            const chatHistory = await chatbotService.getConversationMessages(Number(id));
            return NextResponse.json(chatHistory);
        }

        const conversations = await chatbotService.getAllConversationSummary();
        return NextResponse.json(conversations);
    } catch (error) {
        console.error("Error fetching conversations:", error);
        return errorResponse("Internal Server Error", 500);
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (!id) {
            return errorResponse("Missing conversation ID", 400);
        }

        const deleted = await chatbotService.deleteConversation(Number(id));
        if (deleted) {
            return NextResponse.json({ success: true });
        } else {
            return errorResponse("Conversation not found", 404);
        }
    } catch (error) {
        console.error("Error deleting conversation:", error);
        return errorResponse("Internal Server Error", 500);
    }
};

export async function POST(req: NextRequest) {
    try {
        const { prompt, conversationId } = await req.json();

        let conversation;
        if (conversationId && conversationId > 0) {
            const currentConversation = await chatbotService.getConversationMessages(Number(conversationId));
            if (currentConversation) {
                conversation = currentConversation;
            }
        }

        // If no conversation, create one
        if (!conversation) {
            conversation = await chatbotService.createConversation(String(prompt));
        }

        // Save user message
        await chatbotService.createMessage({
            conversationId: conversation.id,
            role: 'user',
            content: prompt
        });

        const history: Content[] = conversation.messages.map(m => ({
            role: m.role === 'user' ? 'user' : 'model',
            parts: [{ text: m.content }]
        }));

        // Add current user prompt to history for the model
        history.push({ role: 'user', parts: [{ text: prompt }] });

        const encoder = new TextEncoder();
        const stream = new ReadableStream({
            async start(controller) {
                const sendEvent = (event: TChatbotEvent) => {
                    controller.enqueue(encoder.encode(`data: ${JSON.stringify(event)}\n\n`));
                };

                const systemInstruction = chatbotSystemInstruction();

                try {
                    // Send an initial thought
                    sendEvent({ done: false, type: 'thought', content: 'Analisando os seus dados...' });

                    const config: GenerateContentConfig = {
                        systemInstruction: systemInstruction,
                        thinkingConfig: {
                            includeThoughts: true
                        },
                        tools: [{ functionDeclarations: chatbotTools }],
                    };

                    let fullText = "";
                    const currentContents = [...history];

                    while (true) {
                        const response = await ai.models.generateContentStream({
                            model: MODEL_NAME,
                            contents: currentContents,
                            config,
                        });

                        let hasFunctionCall = false;
                        const functionCalls: FunctionCall[] = [];
                        let thoughtSignature = "";

                        for await (const chunk of response) {
                            const candidate = chunk.candidates?.[0];
                            const parts = candidate?.content?.parts;

                            const sig = parts?.[0]?.thoughtSignature;
                            if (sig) thoughtSignature = sig;

                            if (parts) {
                                for (const part of parts) {
                                    if (part.thought) {
                                        sendEvent({ done: false, type: 'thought', content: part.text || "" });
                                    } else if (part.text) {
                                        const chunkText = part.text;
                                        fullText += chunkText;
                                        sendEvent({ done: false, type: 'text', content: chunkText });
                                    } else if (part.functionCall) {
                                        hasFunctionCall = true;
                                        functionCalls.push(part.functionCall);
                                    }
                                }
                            }
                        }

                        if (hasFunctionCall) {
                            // Push the model's call to history
                            currentContents.push({ role: 'model', parts: functionCalls.map(fc => ({ functionCall: fc, thoughtSignature })) });

                            for (const fc of functionCalls) {
                                const fnName = fc.name;
                                const parsedFnName = ChatbotFunctionSchema.safeParse(fnName);
                                if (parsedFnName.success) {
                                    sendEvent({ done: false, type: 'function_call', content: functionStepMap[parsedFnName.data] || `Executando ${fc}...` });

                                    const result = await chatbotService.handleFunctionCall(parsedFnName.data, fc.args);

                                    // Push result to history
                                    currentContents.push({
                                        role: 'user',
                                        parts: [{
                                            functionResponse: {
                                                name: fc.name,
                                                response: { result },
                                                id: fc.id
                                            }
                                        }]
                                    });
                                }

                            }
                            // Continue the loop to get the next response from Gemini
                            continue;
                        }

                        // If we reach here, it's the final text response
                        break;
                    }

                    // Save assistant message
                    await chatbotService.createMessage({
                        conversationId: conversation.id,
                        role: 'model',
                        content: fullText,
                    });

                    sendEvent({ done: true, type: 'text', content: fullText, conversationId: conversation.id });
                    controller.close();
                } catch (err: unknown) {
                    console.error("Chatbot Streaming Error:", err);
                    const error = err as ApiError;
                    let errorMessage = "O serviço encontrou um problema.";

                    if (error?.status === 503) {
                        errorMessage = "O modelo está com alta demanda no momento. Por favor, tente novamente em alguns instantes.";
                    }

                    sendEvent({ done: true, type: 'error', message: errorMessage });
                    controller.close();
                }
            }
        });

        return new Response(stream, {
            headers: {
                'Content-Type': 'text/event-stream',
                'Cache-Control': 'no-cache',
                'Connection': 'keep-alive',
            },
        });

    } catch (error) {
        console.error("Error fetching conversations:", error);
        return errorResponse("Internal Server Error", 500);
    }
}
