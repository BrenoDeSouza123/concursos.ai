"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Brain, Loader2 } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const errorMsg = searchParams.get("error");
  
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(errorMsg === "CredentialsSignin" ? "Login ou senha inválidos." : "");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await signIn("credentials", {
      email,
      senha,
      redirect: false,
    });

    if (res?.error) {
      setError(res.error);
      setLoading(false);
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4 font-sans">
      <Link href="/" className="flex items-center gap-2 font-bold text-2xl text-primary mb-8">
        <Brain className="h-8 w-8" /> Concursos.ai
      </Link>
      
      <Card className="w-full max-w-md shadow-xl border-slate-200">
        <CardHeader className="space-y-2 text-center pb-6">
          <CardTitle className="text-2xl font-bold">Bem-vindo de volta</CardTitle>
          <CardDescription>
            Entre na sua conta para continuar seus simulados.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            {error && <div className="p-3 bg-red-50 text-red-600 border border-red-200 rounded-lg text-sm font-medium text-center">{error}</div>}
            
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">E-mail</label>
              <Input 
                type="email" 
                placeholder="exemplo@concursos.ai" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-12"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Senha</label>
              <Input 
                type="password" 
                placeholder="Sua senha secreta" 
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required
                className="h-12"
              />
            </div>
            
            <Button type="submit" size="lg" className="w-full h-12 mt-2 shadow-md shadow-primary/20" disabled={loading}>
              {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : "Entrar no Sistema"}
            </Button>
          </form>
          
          <div className="mt-6 text-center text-sm text-slate-500">
            Ainda não tem uma conta?{" "}
            <Link href="/register" className="text-primary font-bold hover:underline">
              Crie grátis agora
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 flex justify-center items-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>}>
      <LoginForm />
    </Suspense>
  );
}
