"use client";

import { useState } from "react";
import { LoginForm } from "@/components/ui/login-form";
import { SignupForm } from "@/components/ui/signup-form";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="w-full max-w-md bg-white rounded-lg p-6 shadow-lg">
      {isLogin ? (
        <LoginForm onSignupClick={() => setIsLogin(false)} />
      ) : (
        <SignupForm onLoginClick={() => setIsLogin(true)} />
      )}
    </div>
  );
}
