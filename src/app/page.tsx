"use client";

import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { ArrowRight, Brain, BookOpen, Target, Sparkles, CheckCircle } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-primary/20">
      {/* Header/Nav */}
      <header className="fixed w-full bg-white/80 backdrop-blur-md z-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl text-primary">
            <Brain className="h-6 w-6" /> Concursos.ai
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <a href="#funcionalidades" className="hover:text-primary transition-colors">Funcionalidades</a>
            <a href="#como-funciona" className="hover:text-primary transition-colors">Como Funciona</a>
            <Link href="/pricing" className="hover:text-primary transition-colors">Planos</Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-semibold text-primary hover:text-primary/80 transition-colors hidden sm:block">
              Entrar
            </Link>
            <Link href="/register" className={buttonVariants({ variant: "default", size: "sm", className: "shadow-md" })}>
              Começar Grátis
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 pt-24">
        <section className="py-20 lg:py-32 overflow-hidden relative">
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl opacity-50" />
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-blue-400/10 rounded-full blur-3xl opacity-50" />
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-semibold text-sm mb-8 ring-1 ring-primary/20">
              <Sparkles className="h-4 w-4" /> Inteligência Artificial para Concursos
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 mb-6 max-w-4xl mx-auto leading-tight">
              Passe mais rápido com <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-500">simulados inteligentes.</span>
            </h1>
            <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
              Diga adeus as questões repetidas. Nossa IA mapeia o edital da sua banca, entende seus pontos fracos e gera questões inéditas focadas na sua aprovação.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/register" className={buttonVariants({ size: "lg", className: "w-full sm:w-auto text-base px-8 py-6 shadow-xl shadow-primary/20 hover:scale-105 transition-transform" })}>
                Gerar Meu Primeiro Simulado <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link href="/pricing" className={buttonVariants({ variant: "outline", size: "lg", className: "w-full sm:w-auto text-base px-8 py-6 border-slate-300 hover:bg-slate-100" })}>
                Ver Planos
              </Link>
            </div>
            <p className="mt-6 text-sm text-slate-500 font-medium">Não é necessário cartão de crédito para testar.</p>
          </div>
        </section>

        {/* Features / Como Funciona */}
        <section id="funcionalidades" className="py-24 bg-white border-y border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">A tecnologia a favor da sua nomeação</h2>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                Não somos apenas um banco de questões estático. O Concursos.ai é um treinador adaptativo voltado 100% para o seu edital.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-10">
              <div className="bg-slate-50 rounded-2xl p-8 border border-slate-100 hover:shadow-lg transition-shadow">
                <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-6 text-primary">
                  <Brain className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-slate-900">IA Generativa Avançada</h3>
                <p className="text-slate-600 leading-relaxed">
                  O motor da API do Gemini analisa a forma como a FGV, CEBRASPE ou FCC escreve e formula alternativas consistentes e perfeitamente equilibradas. Nenhuma questão será repetida.
                </p>
              </div>

              <div className="bg-slate-50 rounded-2xl p-8 border border-slate-100 hover:shadow-lg transition-shadow">
                <div className="w-14 h-14 bg-emerald-500/10 rounded-xl flex items-center justify-center mb-6 text-emerald-600">
                  <Target className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-slate-900">Simulados Multi-Disciplinas</h3>
                <p className="text-slate-600 leading-relaxed">
                  Crie uma prova exata como você enfrentará. Misture blocos de Direito Administrativo, Constitucional e Língua Portuguesa escolhendo a quantidade de cada matéria.
                </p>
              </div>

              <div className="bg-slate-50 rounded-2xl p-8 border border-slate-100 hover:shadow-lg transition-shadow">
                <div className="w-14 h-14 bg-blue-500/10 rounded-xl flex items-center justify-center mb-6 text-blue-600">
                  <BookOpen className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-slate-900">Mentoria Pós-Questão</h3>
                <p className="text-slate-600 leading-relaxed">
                  Errou a questão? O Concursos.ai não te mostra apenas a letra. Ele fundamenta usando jurisprudências, súmulas e doutrinas essenciais, indicando exatamente sua falha.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Básico */}
        <section className="py-24 bg-slate-900 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
          <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Pronto para dominar as provas?</h2>
            <p className="text-xl text-slate-300 mb-10">
              Junte-se à nova era da preparação para concursos públicos. Assuma o controle.
            </p>
            <Link href="/register" className={buttonVariants({ variant: "default", size: "lg", className: "text-lg px-10 py-7 bg-white text-slate-900 hover:bg-slate-100" })}>
              Experimente o Concursos.ai Grátis
            </Link>
          </div>
        </section>
      </main>

      <footer className="bg-white border-t border-slate-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
          <div className="flex items-center gap-2 font-bold text-xl text-slate-900 mb-4">
            <Brain className="h-6 w-6 text-primary" /> Concursos.ai
          </div>
          <p className="text-slate-500 text-sm">
            © {new Date().getFullYear()} EdTech IA Inc. Democratizando o ensino.
          </p>
        </div>
      </footer>
    </div>
  );
}
