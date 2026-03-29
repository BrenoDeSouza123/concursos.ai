"use client";

import { useState } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function Pricing() {
  const [isAnnual, setIsAnnual] = useState(true);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 py-20 px-4 sm:px-6 lg:px-8 selection:bg-primary/20">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Hero */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-6">
          <Badge variant="outline" className="text-primary border-primary/30 px-4 py-1.5 text-sm mb-4">
            Aprovação Acelerada por IA
          </Badge>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-900">
            Invista no seu <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">futuro cargo público.</span>
          </h1>
          <p className="text-lg text-slate-600 mx-auto">
            Planos feitos para concurseiros sérios. Tenha acesso à ferramenta EdTech mais avançada e desbanque a concorrência.
          </p>

          {/* Toggle Mensal/Anual */}
          <div className="flex items-center justify-center pt-8">
            <div className="bg-slate-200/50 p-1 rounded-full flex gap-1 items-center border border-slate-200 shadow-inner">
              <button
                className={`px-6 py-2.5 rounded-full text-sm font-medium transition-colors ${!isAnnual ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
                onClick={() => setIsAnnual(false)}
              >
                Mensal
              </button>
              <button
                className={`px-6 py-2.5 rounded-full text-sm font-medium transition-colors flex items-center gap-2 ${isAnnual ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
                onClick={() => setIsAnnual(true)}
              >
                Anual <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full leading-tight font-bold">2 meses grátis</span>
              </button>
            </div>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto items-center">
          
          {/* Iniciante */}
          <Card className="border shadow-sm p-2 flex flex-col hover:border-slate-300 transition-all bg-white">
            <CardHeader>
              <CardTitle className="text-xl">Iniciante</CardTitle>
              <CardDescription>Para testar as águas.</CardDescription>
              <div className="mt-4 flex items-baseline text-4xl font-extrabold">
                Grátis
              </div>
            </CardHeader>
            <CardContent className="flex-1">
              <ul className="space-y-4 text-sm text-slate-600">
                <li className="flex items-center gap-3"><Check className="h-4 w-4 text-slate-400" /> 1 Simulado Inédito por Mês</li>
                <li className="flex items-center gap-3"><Check className="h-4 w-4 text-slate-400" /> Questões de base (bancas fáceis)</li>
                <li className="flex items-center gap-3"><Check className="h-4 w-4 text-slate-400" /> Histórico de 7 dias limitados</li>
              </ul>
            </CardContent>
            <CardFooter>
              <Link href="/dashboard" className={buttonVariants({ variant: "outline", className: "w-full py-6 text-md font-semibold" })}>
                Começar Grátis
              </Link>
            </CardFooter>
          </Card>

          {/* Aprovado (Destaque Principal) */}
          <Card className="border-2 border-primary shadow-2xl p-2 relative flex flex-col md:-mt-8 transform transition-transform hover:-translate-y-2 bg-white ring-4 ring-primary/10">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <span className="bg-primary text-primary-foreground text-xs font-bold uppercase tracking-widest py-1.5 px-4 rounded-full shadow-lg">
                Mais Popular
              </span>
            </div>
            <CardHeader className="pt-8">
              <CardTitle className="text-2xl text-primary">Aprovado</CardTitle>
              <CardDescription>O parceiro ideal rumo à nomeação.</CardDescription>
              <div className="mt-4 flex items-baseline text-5xl font-extrabold text-slate-900">
                <span className="text-2xl font-bold text-slate-500 mr-1">R$</span>
                {isAnnual ? '39,90' : '49,90'}
                <span className="text-lg font-medium text-slate-500 ml-1">/mês</span>
              </div>
            </CardHeader>
            <CardContent className="flex-1">
              <ul className="space-y-4 text-sm font-medium text-slate-700">
                <li className="flex items-start gap-3"><Check className="h-5 w-5 text-primary shrink-0" /> Simulados Inéditos Ilimitados</li>
                <li className="flex items-start gap-3"><Check className="h-5 w-5 text-primary shrink-0" /> Todas as Bancas (FGV, Cebraspe, FCC, etc)</li>
                <li className="flex items-start gap-3"><Check className="h-5 w-5 text-primary shrink-0" /> Explicação Detalhada do Gabarito pela IA</li>
                <li className="flex items-start gap-3"><Check className="h-5 w-5 text-primary shrink-0" /> Monitoramento de Ponto Fraco</li>
              </ul>
            </CardContent>
            <CardFooter>
              <Link href="/dashboard" className={buttonVariants({ className: "w-full py-6 text-md font-bold shadow-lg shadow-primary/30" })}>
                Caminho da Aprovação <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </CardFooter>
          </Card>

          {/* Elite IA */}
          <Card className="border shadow-sm p-2 flex flex-col hover:border-slate-300 transition-all bg-white relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 w-32 h-32 bg-slate-900 rounded-bl-full -mr-16 -mt-16 opacity-5 group-hover:scale-150 transition-transform duration-500" />
            <CardHeader>
              <CardTitle className="text-xl">Elite IA</CardTitle>
              <CardDescription>Recursos massivos de inteligência e mentoria.</CardDescription>
              <div className="mt-4 flex items-baseline text-4xl font-extrabold text-slate-900">
                <span className="text-xl font-bold text-slate-500 mr-1">R$</span>
                {isAnnual ? '79,90' : '99,90'}
                <span className="text-lg font-medium text-slate-500 ml-1">/mês</span>
              </div>
            </CardHeader>
            <CardContent className="flex-1">
              <ul className="space-y-4 text-sm text-slate-600">
                <li className="flex items-center gap-3"><Check className="h-4 w-4 text-slate-400" /> Tudo do plano Aprovado</li>
                <li className="flex items-center gap-3 font-semibold text-slate-800"><Check className="h-4 w-4 text-emerald-500" /> Chat com a IA sobre a questão</li>
                <li className="flex items-center gap-3"><Check className="h-4 w-4 text-slate-400" /> Raio-X de editais com predição</li>
              </ul>
            </CardContent>
            <CardFooter>
              <Link href="/dashboard" className={buttonVariants({ variant: "outline", className: "w-full py-6 text-md font-semibold border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white" })}>
                Assinar Elite IA
              </Link>
            </CardFooter>
          </Card>

        </div>
      </div>
    </div>
  );
}
