"use client";
import AuthPage from "@/components/Auth";
import Image from "next/image";
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
    <div
      className="flex min-h-screen items-center justify-center bg-gray-100 p-4 bg-cover bg-center"
      style={{ backgroundImage: "url('/assets/logo.png')" }}
    >
      <div className="w-full max-w-md">
        <AuthPage />
      </div>
    </div>
  );
}
