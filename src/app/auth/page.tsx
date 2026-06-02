"use client";
import type { SubmitEventHandler } from "react";
import { useState } from "react";
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

export default function Authentication() {
  const [isLogin, setIsLogin] = useState<boolean>(true);

  const onSubmit: SubmitEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    console.log("Email recebido:", email);
    console.log("Senha recebida:", password);

    if (!isLogin) {
      const name = formData.get("name") as string;
      const confirmPassword = formData.get("confirm-password") as string;

      console.log("Nome:", name);
      console.log("Confirmação de Senha:", confirmPassword);

      // Aqui você faz a chamada para a API de Cadastro
    } else {
      // Aqui você faz a chamada para a API de Login
    }
  };

  return (
    <div className="flex min-h-screen">
      <div className="flex w-full md:w-[30%] items-center justify-center bg-gray-100 p-8">
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
                    <Input id="password" type="password" name="password" required />
                    <FieldDescription>
                      Deve ter pelo menos 8 caracteres.
                    </FieldDescription>
                  </Field>
                  {!isLogin && (
                    <Field>
                      <FieldLabel htmlFor="confirm-password">
                        Confirmar Senha
                      </FieldLabel>
                      <Input id="confirm-password" type="password" name="confirm-password" required />
                      <FieldDescription>
                        Por favor, confirme sua senha
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
