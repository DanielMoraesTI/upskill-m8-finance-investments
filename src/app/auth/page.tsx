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
import { useApp } from "@/context/AppProvider";

export default function Authentication() {
  const [isLogin, setIsLogin] = useState<boolean>(true);
  const router = useRouter();
  const { resultMessage, setResultMessage, result, setResult } = useApp();

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
    <div className="flex min-h-screen bg-background">
      {/* ── Painel do formulário ── */}
      <div className="relative flex w-full md:w-[38%] lg:w-[32%] items-center justify-center bg-card/80 backdrop-blur-sm border-r border-border p-8 md:p-12">
        {/** Efeito Overlay enquanto orquestra o redirecionamento */}
        {result === "success" && <Loading />}

        {/* Glow decorativo no topo */}
        <div className="pointer-events-none absolute -top-32 -left-32 w-80 h-80 rounded-full bg-primary/10 blur-3xl" />

        <div className="relative z-10 w-full max-w-sm">
          <Card className="border-border/60 bg-card/60 backdrop-blur-sm shadow-2xl">
            <CardHeader className="pb-4">
              <CardTitle className="text-base font-semibold text-foreground">
                {isLogin ? "Entrar na conta" : "Preencha seus dados"}
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground">
                {`${isLogin ? "Informe seu e-mail e senha" : "Crie sua conta gratuitamente"}`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={onSubmit}>
                <FieldGroup>
                  {!isLogin && (
                    <Field>
                      <FieldLabel
                        htmlFor="name"
                        className="text-sm font-medium text-foreground/80"
                      >
                        Nome Completo
                      </FieldLabel>
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        placeholder="Seu nome completo"
                        required
                        className="bg-muted/40 border-border/60 focus:border-primary/60 focus:ring-primary/20 transition-colors"
                      />
                    </Field>
                  )}
                  <Field>
                    <FieldLabel
                      htmlFor="email"
                      className="text-sm font-medium text-foreground/80"
                    >
                      E-mail
                    </FieldLabel>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="nome@exemplo.com"
                      required
                      className="bg-muted/40 border-border/60 focus:border-primary/60 focus:ring-primary/20 transition-colors"
                    />
                    <FieldDescription className="text-xs text-muted-foreground/70">
                      Seu e-mail não será compartilhado com terceiros.
                    </FieldDescription>
                  </Field>
                  <Field>
                    <FieldLabel
                      htmlFor="password"
                      className="text-sm font-medium text-foreground/80"
                    >
                      Senha
                    </FieldLabel>
                    <Input
                      id="password"
                      type="password"
                      name="password"
                      required
                      className="bg-muted/40 border-border/60 focus:border-primary/60 focus:ring-primary/20 transition-colors"
                    />
                    {!isLogin && (
                      <FieldDescription className="text-xs text-muted-foreground/70">
                        Deve ter pelo menos 6 caracteres.
                      </FieldDescription>
                    )}
                  </Field>
                  {!isLogin && (
                    <Field>
                      <FieldLabel
                        htmlFor="confirm-password"
                        className="text-sm font-medium text-foreground/80"
                      >
                        Confirmar Senha
                      </FieldLabel>
                      <Input
                        id="confirm-password"
                        type="password"
                        name="confirm-password"
                        required
                        className="bg-muted/40 border-border/60 focus:border-primary/60 focus:ring-primary/20 transition-colors"
                      />
                      <FieldDescription className="text-xs text-muted-foreground/70">
                        Por favor, confirme sua senha
                      </FieldDescription>
                    </Field>
                  )}
                  {resultMessage && (
                    <Field>
                      <FieldDescription
                        className={`w-full text-center text-xs font-medium px-3 py-2 rounded-lg ${result === "error" ? "text-destructive bg-destructive/10 border border-destructive/20" : "text-emerald-400 bg-emerald-950/50 border border-emerald-800/40"}`}
                      >
                        {resultMessage}
                      </FieldDescription>
                    </Field>
                  )}
                  <FieldGroup>
                    <Field>
                      <Button
                        type="submit"
                        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-lg glow-blue transition-all duration-200"
                      >
                        {isLogin ? "Entrar" : "Criar conta"}
                      </Button>
                      <FieldDescription className="px-6 text-center text-xs text-muted-foreground">
                        {isLogin
                          ? "Ainda não possui uma conta?"
                          : "Já possui uma conta?"}{" "}
                        <button
                          type="button"
                          className="text-primary hover:text-primary/80 hover:underline font-medium transition-colors"
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

      {/* ── Painel visual direito ── */}
      <div
        className="hidden md:flex md:flex-1 min-h-screen bg-cover bg-center"
        style={{ backgroundImage: "url('/assets/logo-b.png')" }}
      />
    </div>
  );
}
