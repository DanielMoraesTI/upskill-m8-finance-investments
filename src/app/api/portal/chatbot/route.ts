import ai from "@/app/api/_lib/gemini";
import { NextRequest, NextResponse } from "next/server";
import type { TChatbotEvent } from "@/schemas/chatbotSchema";
import type {
  Content,
  ApiError,
  GenerateContentConfig,
  FunctionCall,
} from "@google/genai";
import { errorResponse } from "@/app/api/_utils/serverUtils";
import { chatbotSystemInstruction } from "@/app/api/_utils/geminiPrompts";
import {
  chatbotTools,
  ChatbotFunctionSchema,
} from "@/app/api/_utils/chatbot.functions";
import chatbotService from "@/app/api/_services/chatbot.service";
import userService from "@/app/api/_services/user.service";

const MODEL_NAME =
  process.env.GEMINI_MODEL_NAME || "gemini-3.1-flash-lite-preview";

const functionStepMap: Record<string, string> = {
  get_investment_summary: "Consultando resumo financeiro...",
};
// Esta função assí­ncrona processa as requisições POST para o endpoint "/api/portal/chatbot", interagindo com o modelo de inteligência artificial do Google Gemini para gerar respostas baseadas em prompts do usuário. Ela valida o ID do usuário autorizado, processa os eventos de resposta do modelo, incluindo chamadas de função, e retorna os resultados apropriados, tratando erros de rede e validação.
export async function GET(req: NextRequest) {
  try {
    // validar o userID
    const authorizedUser = await userService.requireAuth(req);
    if (!authorizedUser) {
      return errorResponse("Não autorizado", 401);
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (id) {
      const chatHistory = await chatbotService.getConversationMessages(
        authorizedUser.id,
        Number(id),
      );
      return NextResponse.json(chatHistory);
    }

    const conversations = await chatbotService.getAllConversationSummary(
      authorizedUser.id,
    );
    return NextResponse.json(conversations);
  } catch (error) {
    console.error("Erro ao buscar conversas:", error);
    return errorResponse("Erro interno do servidor", 500);
  }
}
// Esta função assí­ncrona processa as requisições DELETE para o endpoint "/api/portal/chatbot", permitindo que o usuário autorizado exclua uma conversa especí­fica com base no ID fornecido. Ela valida o ID do usuário, trata erros de rede e retorna respostas apropriadas em caso de falha.
export async function DELETE(req: NextRequest) {
  try {
    // validar o userID
    const authorizedUser = await userService.requireAuth(req);
    if (!authorizedUser) {
      return errorResponse("NÃ£o autorizado", 401);
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return errorResponse("ID da conversa ausente", 400);
    }

    const deleted = await chatbotService.deleteConversation(
      authorizedUser.id,
      Number(id),
    );
    if (deleted) {
      return NextResponse.json({ success: true });
    } else {
      return errorResponse("Conversa não encontrada", 404);
    }
  } catch (error) {
    console.error("Erro ao excluir conversa:", error);
    return errorResponse("Erro interno do servidor", 500);
  }
}
// Esta função assí­ncrona processa as requisições POST para o endpoint "/api/portal/chatbot", interagindo com o modelo de inteligência artificial do Google Gemini para gerar respostas baseadas em prompts do usuário. Ela valida o ID do usuário autorizado, processa os eventos de resposta do modelo, incluindo chamadas de função, e retorna os resultados apropriados, tratando erros de rede e validação.
export async function POST(req: NextRequest) {
  try {
    // validar o userID
    const authorizedUser = await userService.requireAuth(req);
    if (!authorizedUser) {
      return errorResponse("NÃ£o autorizado", 401);
    }

    const { prompt, conversationId } = await req.json();

    let conversation;
    if (conversationId && conversationId > 0) {
      const currentConversation = await chatbotService.getConversationMessages(
        authorizedUser.id,
        Number(conversationId),
      );
      if (currentConversation) {
        conversation = currentConversation;
      }
    }

    // Se não houver uma conversa existente, cria uma nova conversa
    if (!conversation) {
      conversation = await chatbotService.createConversation(
        authorizedUser.id,
        String(prompt),
      );
    }

    // Salva a mensagem do usuário na conversa
    await chatbotService.createMessage({
      conversationId: conversation.id,
      role: "user",
      content: prompt,
    });

    const history: Content[] = conversation.messages.map((m) => ({
      role: m.role === "user" ? "user" : "model",
      parts: [{ text: m.content }],
    }));

    // Faz a chamada para o modelo Gemini com o histórico da conversa e o prompt do usuário, processando os eventos de resposta em tempo real e retornando-os como um stream de eventos.
    history.push({ role: "user", parts: [{ text: prompt }] });

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        const sendEvent = (event: TChatbotEvent) => {
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify(event)}\n\n`),
          );
        };

        const systemInstruction = chatbotSystemInstruction();

        try {
          // Enviar um evento inicial de "thought" para indicar que o modelo está processando os dados do usuário.
          sendEvent({
            done: false,
            type: "thought",
            content: "Analisando os seus dados...",
          });

          const config: GenerateContentConfig = {
            systemInstruction: systemInstruction,
            thinkingConfig: {
              includeThoughts: true,
            },
            tools: [{ functionDeclarations: chatbotTools }],
          };

          let fullText = "";
          const currentContents = [...history];
          // Loop para lidar com chamadas de função e continuar a conversa até que o modelo forneça uma resposta final de texto.
          while (true) {
            const response = await ai.models.generateContentStream({
              model: MODEL_NAME,
              contents: currentContents,
              config,
            });

            let hasFunctionCall = false;
            const functionCalls: FunctionCall[] = [];
            let thoughtSignature = "";
            // Processa o stream de eventos do modelo Gemini, lidando com pensamentos, textos e chamadas de função, e enviando eventos apropriados para o cliente em tempo real.
            for await (const chunk of response) {
              const candidate = chunk.candidates?.[0];
              const parts = candidate?.content?.parts;

              const sig = parts?.[0]?.thoughtSignature;
              if (sig) thoughtSignature = sig;

              if (parts) {
                for (const part of parts) {
                  if (part.thought) {
                    sendEvent({
                      done: false,
                      type: "thought",
                      content: part.text || "",
                    });
                  } else if (part.text) {
                    const chunkText = part.text;
                    fullText += chunkText;
                    sendEvent({
                      done: false,
                      type: "text",
                      content: chunkText,
                    });
                  } else if (part.functionCall) {
                    hasFunctionCall = true;
                    functionCalls.push(part.functionCall);
                  }
                }
              }
            }

            if (hasFunctionCall) {
              // Se houver chamadas de função, envia um evento de "function_call" para o cliente e processa cada chamada de função, chamando a função apropriada no backend e salvando os resultados na conversa.
              currentContents.push({
                role: "model",
                parts: functionCalls.map((fc) => ({
                  functionCall: fc,
                  thoughtSignature,
                })),
              });

              for (const fc of functionCalls) {
                const fnName = fc.name;
                const parsedFnName = ChatbotFunctionSchema.safeParse(fnName);
                if (parsedFnName.success) {
                  sendEvent({
                    done: false,
                    type: "function_call",
                    content:
                      functionStepMap[parsedFnName.data] ||
                      `Executando ${fc}...`,
                  });

                  const result = await chatbotService.handleFunctionCall(
                    authorizedUser.id,
                    parsedFnName.data,
                    fc.args,
                  );

                  // Salva a resposta da função na conversa, permitindo que o modelo Gemini continue a conversa com base nos resultados da função chamada.
                  currentContents.push({
                    role: "user",
                    parts: [
                      {
                        functionResponse: {
                          name: fc.name,
                          response: { result },
                          id: fc.id,
                        },
                      },
                    ],
                  });
                }
              }
              // Continua o loop para processar a próxima rodada de respostas do modelo Gemini, agora com os resultados das funções chamadas incluí­dos no histórico da conversa.
              continue;
            }

            // Se não houver mais chamadas de função, envia um evento final de "done" com o texto completo da resposta do modelo Gemini e fecha o stream de eventos.
            break;
          }

          // Salva a resposta final do modelo na conversa, permitindo que o histórico da conversa seja mantido para futuras interações.
          await chatbotService.createMessage({
            conversationId: conversation.id,
            role: "model",
            content: fullText,
          });

          sendEvent({
            done: true,
            type: "text",
            content: fullText,
            conversationId: conversation.id,
          });
          controller.close();
        } catch (err: unknown) {
          console.error("Erro de streaming do chatbot:", err);
          const error = err as ApiError;
          let errorMessage = "O serviÃ§o encontrou um problema.";
          // Se o erro for um 503, indica que o modelo está com alta demanda, então envia uma mensagem apropriada para o usuário.
          if (error?.status === 503) {
            errorMessage =
              "O modelo está com alta demanda no momento. Por favor, tente novamente em alguns instantes.";
          }
          // Se o erro for um 429, indica que o usuário atingiu o limite de uso da IA, então envia uma mensagem apropriada para o usuário.
          else if (error?.status === 429) {
            errorMessage =
              "Você atingiu o limite de uso da IA. Tente novamente mais tarde ou verifique seu plano.";
          }

          sendEvent({ done: true, type: "error", message: errorMessage });
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("Erro ao buscar conversas:", error);
    return errorResponse("Erro interno do servidor", 500);
  }
}
