"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Brain, CheckCircle, Loader2 } from "lucide-react";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, email, senha })
      });
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || "Erro ao cadastrar.");
      }
      
      // Auto redirect to login after success
      router.push("/login?registered=true");
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row justify-center items-center p-4 font-sans gap-8">
      
      {/* Informative Side */}
      <div className="max-w-md hidden md:flex flex-col gap-6 text-slate-700">
        <Link href="/" className="flex items-center gap-2 font-bold text-3xl text-primary mb-4">
          <Brain className="h-10 w-10" /> Concursos.ai
        </Link>
        <h2 className="text-4xl font-extrabold text-slate-900 leading-tight">
          A sua aprovação começa a ser construída agora.
        </h2>
        <ul className="space-y-4 mt-4 font-medium">
          <li className="flex gap-3 items-center"><CheckCircle className="text-emerald-500 h-6 w-6" /> Simulados Inéditos Diários</li>
          <li className="flex gap-3 items-center"><CheckCircle className="text-emerald-500 h-6 w-6" /> Explicação Detalhada do Gemini 3</li>
          <li className="flex gap-3 items-center"><CheckCircle className="text-emerald-500 h-6 w-6" /> Dashboard de Performance Focada</li>
        </ul>
      </div>

      {/* Form Side */}
      <Card className="w-full max-w-md shadow-2xl border-slate-200">
        <CardHeader className="space-y-2 pb-6">
          <CardTitle className="text-2xl font-bold">Criar conta grátis</CardTitle>
          <CardDescription>
            Comece pelo plano Iniciante. Sem cartão de crédito.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRegister} className="space-y-4">
            {error && <div className="p-3 bg-red-50 text-red-600 border border-red-200 rounded-lg text-sm font-medium">{error}</div>}
            
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Nome Completo</label>
              <Input 
                type="text" 
                placeholder="Lucas Silva" 
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                required
                className="h-12"
              />
            </div>
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
              <label className="text-sm font-semibold text-slate-700">Senha Segura</label>
              <Input 
                type="password" 
                placeholder="Mínimo de 6 caracteres" 
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required
                minLength={6}
                className="h-12"
              />
            </div>
            
            <Button type="submit" size="lg" className="w-full h-12 mt-4 shadow-lg shadow-primary/30 text-white font-bold" disabled={loading}>
              {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : "Garantir Minha Vaga"}
            </Button>
          </form>
          
          <div className="mt-6 text-center text-sm text-slate-500">
            Já é um assinante?{" "}
            <Link href="/login" className="text-primary font-bold hover:underline">
              Fazer login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
