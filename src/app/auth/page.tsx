"use client";
import type { SubmitEventHandler } from "react";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import type { TCreateUser } from "@/schemas/userSchema";
import { handleSignup, userDataFromForm } from "@/services/authService";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import Loading from "@/components/Loading";
import { useRouter } from "next/navigation";

export default function Authentication() {
  const [isLogin, setIsLogin] = useState<boolean>(true);
  const [resultMessage, setResultMessage] = useState<string>("");
  const [result, setResult] = useState<"success" | "error" | null>(null);
  const router = useRouter();

  // Reset automático do estado de resultado após 5 segundos para limpar mensagens de feedback
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  useEffect(() => {
    if (result) {
      timeoutRef.current = setTimeout(() => {
        setResult(null);
        setResultMessage("");
      }, 5000);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [result, resultMessage]);

  const onSubmit: SubmitEventHandler<HTMLFormElement> = async (e) => {
    try {
      e.preventDefault();
      const formData = new FormData(e.currentTarget);
      const userData = userDataFromForm(formData);

      // Se for um cadastro, validar a senha e fazer a requisição de criação de usuário
      if (!isLogin) {
        const confirmPassword = formData.get("confirm-password") as string;
        if (userData.password !== confirmPassword) {
          handleAuthResult("error", "As senhas não coincidem");
          return;
        }

        await handleSignup(userData as TCreateUser);
      }

      await signInWithEmailAndPassword(auth, userData.email, userData.password);
      handleAuthResult(
        "success",
        isLogin ? "Login bem-sucedido!" : "Conta criada com sucesso!",
      );
    } catch {
      handleAuthResult(
        "error",
        isLogin ? "Email/Senha inválidos" : "Erro ao criar conta",
      );
    }
  };

  const handleAuthResult = (result: "success" | "error", message: string) => {
    setResultMessage(message);
    setResult(result);

    if (result === "success") {
      router.push("/portal");
    }
  };

  return (
    <div className="flex min-h-screen">
      <div className="flex w-full md:w-[30%] items-center justify-center bg-gray-100 p-8">
        {/** Efeito Overlay enquanto orquestra o redirecionamento */}
      {result === "success" && <Loading />}

      <div className="w-full max-w-md">
          <Card>
            <CardHeader>
              <CardTitle>{isLogin ? "Entrar" : "Crie sua conta"}</CardTitle>
              <CardDescription>
                {`Informe seus dados abaixo para ${isLogin ? "entrar" : "criar sua conta"}`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={onSubmit}>
                <FieldGroup>
                  {!isLogin && (
                    <Field>
                      <FieldLabel htmlFor="name">Nome Completo</FieldLabel>
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        placeholder="Escreva seu nome completo aqui"
                        required
                      />
                    </Field>
                  )}
                  <Field>
                    <FieldLabel htmlFor="email">E-mail</FieldLabel>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="nome@exemplo.com"
                      required
                    />
                    <FieldDescription>
                      Utilizaremos esta informação para entrar em contato. Seu
                      e-mail não será compartilhado com terceiros.
                    </FieldDescription>
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="password">Senha</FieldLabel>
                    <Input
                    id="password"
                    type="password"
                    name="password"
                    required
                  />
                    <FieldDescription>
                      Deve ter pelo menos 8 caracteres.
                    </FieldDescription>
                  </Field>
                  {!isLogin && (
                    <Field>
                      <FieldLabel htmlFor="confirm-password">
                        Confirmar Senha
                      </FieldLabel>
                      <Input
                      id="confirm-password"
                      type="password"
                      name="confirm-password"
                      required
                    />
                      <FieldDescription>
                        Por favor, confirme sua senha
                      </FieldDescription>
                    </Field>
                  )}
                  {resultMessage && (
                  <Field>
                    <FieldDescription
                      className={`w-full text-center font-medium ${result === "error" ? "text-red-500" : "text-green-500"}`}
                    >
                      {resultMessage}
                    </FieldDescription>
                  </Field>
                )}
                <FieldGroup>
                    <Field>
                      <Button type="submit">
                        {isLogin ? "Entrar" : "Criar conta"}
                      </Button>
                      <FieldDescription className="px-6 text-center">
                        {isLogin
                          ? "Ainda não possui uma conta?"
                          : "Já possui uma conta?"}{" "}
                        <button
                          type="button"
                          className="text-blue-500 hover:underline"
                          onClick={() => setIsLogin(!isLogin)}
                        >
                          {isLogin ? "Cadastre-se" : "Faça login"}
                        </button>
                      </FieldDescription>
                    </Field>
                  </FieldGroup>
                </FieldGroup>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
      <div
        className="hidden md:block md:w-[70%] min-h-screen bg-cover bg-center"
        style={{ backgroundImage: "url('/assets/logo-b.png')" }}
      />
    </div>
  );
}
