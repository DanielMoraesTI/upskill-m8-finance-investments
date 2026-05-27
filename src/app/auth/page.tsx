"use client";
import { useState } from "react";

export default function Authentication() {
  const [email, setEmail] = useState<string>("");
  const [criandoConta, setCriandoConta] = useState<boolean>(false);
  const [password, setPassword] = useState<string>("");

  const onSubmit = () => {
    // do something === QUAL FOI O EMAIL?
    console.log("user email = ", email);
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-foreground">
      {/** imagem de fundo */}

      {/** FORM */}
      <div
        className="flex flex-col bg-background w-[65%] h-fit rounded-lg gap-5"
        style={{ padding: "20px" }}
      >
        <h1>{criandoConta ? "Criar conta" : "Login"}</h1>

        {/** BODY */}
        <div className="flex flex-col gap-5">
          <label htmlFor="email">EMAIL</label>
          <input
            name="email"
            type="email"
            placeholder="Digite seu e-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="off"
          />

          <label htmlFor="password">SENHA</label>
          <input
            name="password"
            type="password"
            placeholder="Digite sua senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="off"
          />
        </div>

        {/** ACTION */}
        <button onClick={onSubmit}>
          {criandoConta ? "Registrar" : "Login"}
        </button>
      </div>

      <button
        className="text-white mt-4"
        onClick={() => setCriandoConta(!criandoConta)}
      >
        {criandoConta
          ? "Já tem uma conta? Fazer login"
          : "Não tem uma conta? Criar Conta"}
      </button>
    </div>
  );
}