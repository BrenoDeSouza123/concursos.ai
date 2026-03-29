"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, BookOpen, Brain, Check, CheckCircle2, XCircle } from "lucide-react";
import Link from "next/link";

export default function SimuladoPlay() {
  const router = useRouter();
  const [simulado, setSimulado] = useState<any>(null);
  const [respostas, setRespostas] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const data = localStorage.getItem("current_simulado");
    if (data) {
      setSimulado(JSON.parse(data));
    } else {
      router.push("/dashboard");
    }
  }, [router]);

  if (!simulado) return <div className="p-20 text-center font-sans">Carregando prova...</div>;

  const handleResponder = (questaoId: string, alternativa: string) => {
    if (!respostas[questaoId]) {
      setRespostas(prev => ({ ...prev, [questaoId]: alternativa }));
    }
  };

  const acertos = Object.keys(respostas).filter(
    qid => respostas[qid] === simulado.questoes.find((q: any) => q.id === qid)?.gabarito
  ).length;

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 font-sans pb-32">
      {/* Navbar Superior do Simulado */}
      <header className="bg-white border-b sticky top-0 z-50 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => router.push("/dashboard")}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="font-bold text-lg text-primary">Simulado Inédito: {simulado.banca.toUpperCase()}</h1>
              <p className="text-xs text-slate-500">{simulado.questoes.length} questões mapeadas pela IA</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 px-3 py-1">
              <CheckCircle2 className="w-4 h-4 mr-1" />
              Acertos: {acertos}
            </Badge>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 mt-8 space-y-6">
        {simulado.questoes.map((questao: any, index: number) => {
          const respondida = !!respostas[questao.id];
          const acertou = respondida && respostas[questao.id] === questao.gabarito;
          
          return (
            <Card key={questao.id} className={`shadow-sm transition-all ${respondida ? (acertou ? 'ring-2 ring-emerald-500/50' : 'ring-2 ring-red-500/50') : 'hover:shadow-md'}`}>
              <CardHeader className="bg-slate-50/50 border-b pb-4">
                <div className="text-xs uppercase font-bold text-primary flex items-center justify-between">
                  <span className="flex items-center gap-1.5"><BookOpen className="h-4 w-4" /> {questao.disciplina}</span>
                  <span className="text-slate-400">Questão {index + 1}</span>
                </div>
                <CardTitle className="text-lg leading-relaxed mt-2 text-slate-800 font-medium">
                  {questao.enunciado}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-3">
                {['A', 'B', 'C', 'D', 'E'].map(letra => {
                  const conteudo = questao.alternativas[letra];
                  if (!conteudo) return null;
                  
                  let stateStyle = "border-slate-200 hover:border-primary/40 hover:bg-slate-50 cursor-pointer";
                  
                  if (respondida) {
                    if (questao.gabarito === letra) {
                      stateStyle = "bg-emerald-50 border-emerald-500 font-medium text-emerald-900 shadow-sm"; // Correta
                    } else if (respostas[questao.id] === letra) {
                      stateStyle = "bg-red-50 border-red-300 text-red-800 line-through opacity-80"; // Errada marcada
                    } else {
                      stateStyle = "opacity-50 border-slate-200 bg-slate-50"; // Neutras
                    }
                  }

                  return (
                    <div 
                      key={letra} 
                      onClick={() => handleResponder(questao.id, letra)}
                      className={`flex items-start p-4 rounded-xl border transition-all ${stateStyle}`}
                    >
                      <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold mr-4 text-sm ${respondida && questao.gabarito === letra ? 'bg-emerald-500 text-white' : 'bg-white border-2 border-inherit text-inherit'}`}>
                        {letra}
                      </div>
                      <div className="pt-1 text-base relative top-[-2px]">
                        {conteudo}
                      </div>
                    </div>
                  );
                })}

                {/* Feedback IA Reveal */}
                {respondida && (
                  <div className={`mt-6 p-5 rounded-2xl border ${acertou ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'}`}>
                    <h4 className={`font-bold text-sm mb-2 flex items-center gap-2 ${acertou ? 'text-emerald-800' : 'text-red-800'}`}>
                      {acertou ? <CheckCircle2 className="h-5 w-5" /> : <XCircle className="h-5 w-5" />}
                      {acertou ? 'Exatamente! Você dominou o conceito.' : 'Não foi dessa vez. Cuidado com a pegadinha!'}
                    </h4>
                    <div className="bg-white/60 p-4 rounded-xl mt-3 text-sm text-slate-700 relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-16 h-16 bg-blue-500/10 rounded-bl-full flex justify-end p-2 items-start opacity-70">
                         <Brain className="h-5 w-5 text-blue-500" />
                      </div>
                      <div className="font-bold text-blue-800 text-xs uppercase mb-1 tracking-wider">Explicação da Inteligência Artificial</div>
                      {questao.explicacao_ia}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </main>
      
      {/* Finish CTA */}
      <div className="max-w-4xl mx-auto px-4 mt-8 flex justify-end">
        <Link href="/dashboard" className={buttonVariants({ size: "lg", className: "shadow-xl shadow-primary/20 bg-slate-900" })}>
          Encerrar Simulado <ArrowLeft className="ml-2 h-4 w-4 rotate-180" />
        </Link>
      </div>

    </div>
  );
}
