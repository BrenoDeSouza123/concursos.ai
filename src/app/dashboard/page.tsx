"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Activity, Brain, CheckCircle, Flame, Loader2, Target, Zap, Plus, Trash2, LogOut, Settings, UserCircle, ChevronDown } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger, DropdownMenuGroup } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";

const DISCIPLINAS_CONCURSO = [
  "Língua Portuguesa", "Raciocínio Lógico Matemático", "Informática", 
  "Direito Constitucional", "Direito Administrativo", "Direito Penal", 
  "Direito Processual Penal", "Direito Civil", "Direito Processual Civil", 
  "Direito do Trabalho", "Direito Tributário", "Administração Pública", "AFO"
];

export default function Dashboard() {
  const router = useRouter();
  const { data: session, status } = useSession();
  
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [statsLoading, setStatsLoading] = useState(true);
  const [stats, setStats] = useState({ taxaAcerto: "0%", totalQuestoes: 0, aderencia: "0%" });
  const [banca, setBanca] = useState("cebraspe");
  const [modulos, setModulos] = useState([{ disciplina: "Direito Constitucional", quantidade: 5 }]);

  useEffect(() => {
    if (status === "authenticated") {
      fetch("/api/user/stats")
        .then(res => res.json())
        .then(data => {
          if (data.success) setStats(data.stats);
        })
        .finally(() => setStatsLoading(false));
    }
  }, [status]);

  const addModulo = () => {
    setModulos([...modulos, { disciplina: "Nova Disciplina", quantidade: 5 }]);
  };

  const removeModulo = (index: number) => {
    setModulos(modulos.filter((_, i) => i !== index));
  };

  const updateModulo = (index: number, key: string, value: any) => {
    const newModulos = [...modulos];
    newModulos[index] = { ...newModulos[index], [key]: value };
    setModulos(newModulos);
  };

  const handleGenerate = async () => {
    setLoading(true);
    setErrorMsg("");
    try {
      const resp = await fetch("/api/generate-simulado", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ banca, modulos })
      });
      const data = await resp.json();
      if (data.success) {
        localStorage.setItem("current_simulado", JSON.stringify(data.simulado));
        router.push("/simulado/play");
      } else {
        setErrorMsg(`Erro retornado: ${data.error} - Detalhes: ${data.details || "Verifique sua chave de integração."}`);
      }
    } catch (err: any) {
      setErrorMsg(`Erro de conexão grave: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading") {
    return <div className="min-h-screen flex items-center justify-center bg-slate-50"><Loader2 className="animate-spin text-primary h-8 w-8" /></div>;
  }
  
  if (status === "unauthenticated" || !session) {
    router.push("/login");
    return null;
  }

  // @ts-ignore
  const plano = (session?.user?.plano as string) || "iniciante";
  const limitReached = plano === "iniciante" && modulos.reduce((a, b) => a + b.quantidade, 0) > 15;

  return (
    <div className="flex h-screen w-full bg-slate-50 text-slate-900 overflow-hidden font-sans">
      {/* Sidebar - Insights da IA */}
      <aside className="w-80 bg-white border-r p-6 hidden lg:flex lg:flex-col overflow-y-auto shadow-sm z-10">
        <div className="flex items-center gap-2 font-bold text-xl text-primary mb-10">
          <Brain className="h-6 w-6" /> Concursos.ai
        </div>
        <div className="space-y-6 flex-1">
          <h2 className="font-semibold text-sm uppercase tracking-wider text-slate-500 mb-2">Insights da IA ✨</h2>
          
          {stats.totalQuestoes > 0 ? (
            <>
              <Card className="bg-blue-50/50 border-blue-100 shadow-none">
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-sm text-blue-800 flex items-center gap-2">
                    <Target className="h-4 w-4" /> Ponto Fraco Identificado
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0 text-sm text-blue-900 border-l-2 border-primary ml-4">
                  Sua taxa de acerto em <strong>{modulos[0]?.disciplina || "Direito Constitucional"}</strong> caiu ultimamente. Revise a teoria!
                </CardContent>
              </Card>

              <Card className="bg-emerald-50/50 border-emerald-100 shadow-none">
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-sm text-emerald-800 flex items-center gap-2">
                    <Zap className="h-4 w-4" /> Recomendação
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0 text-sm text-emerald-900 border-l-2 border-emerald-500 ml-4">
                  Gere um simulado contendo apenas questões da banca para treinar o formato de Certo/Errado.
                </CardContent>
              </Card>
            </>
          ) : (
            <div className="text-sm text-slate-500 bg-slate-50 p-4 rounded-xl border border-slate-100 text-center italic">
              A IA analisará seu desempenho após o seu primeiro simulado!
            </div>
          )}
        </div>
        
        <div className="mt-8 gap-4 flex flex-col">
          <Link href="/" className={buttonVariants({ variant: "outline", className: "w-full justify-start text-slate-600" })}>
            Voltar para Home
          </Link>
          <Link href="/pricing" className={buttonVariants({ variant: "default", className: "w-full justify-start shadow-md" })}>
            Fazer Upgrade VIP
          </Link>
        </div>
      </aside>

      {/* Conteúdo Principal */}
      <main className="flex-1 flex flex-col h-full overflow-y-auto relative">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-md border-b px-8 py-5 flex items-center justify-between sticky top-0 z-20 shadow-sm">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-3">
                Olá, {session.user?.name} 👋 
                {plano === 'elite' && <Badge className="bg-slate-900 text-yellow-500 hover:bg-slate-800">Elite IA</Badge>}
                {plano === 'aprovado' && <Badge className="bg-primary hover:bg-primary/90">Aprovado</Badge>}
                {plano === 'iniciante' && <Badge variant="outline" className="text-slate-500 border-slate-300">Iniciante</Badge>}
              </h1>
              <p className="text-slate-500 text-sm mt-1">{session.user?.email} - Pratique todo dia.</p>
            </div>
          </div>
          
          <div className="flex items-center gap-5">
            {stats.totalQuestoes > 0 && (
              <div className="hidden sm:flex items-center gap-3 bg-orange-50 px-4 py-2 rounded-full border border-orange-100">
                <Flame className="h-5 w-5 text-orange-500" />
                <span className="font-bold text-orange-700">1 dia de ofensiva</span>
              </div>
            )}

            {/* User Mini-Panel Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger className="h-12 w-12 rounded-full p-0 flex items-center justify-center border border-slate-200 shadow-sm hover:shadow-md transition-all outline-none">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-primary/10 text-primary font-bold">
                    {session.user?.name?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-64 mt-2" align="end">
                <DropdownMenuGroup>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none text-slate-900">{session.user?.name}</p>
                      <p className="text-xs leading-none text-slate-500 truncate">{session.user?.email}</p>
                    </div>
                  </DropdownMenuLabel>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem className="cursor-pointer">
                    <Link href="/dashboard/settings" className="flex items-center w-full">
                      <UserCircle className="mr-2 h-4 w-4" />
                      <span>Minha Conta</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer">
                    <Link href="/dashboard/settings?tab=preferencias" className="flex items-center w-full">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Configurações & Preferências</span>
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50" onClick={() => signOut({ callbackUrl: '/' })}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sair com segurança</span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <div className="flex-1 p-8 max-w-5xl w-full mx-auto space-y-8 pb-32">
          {/* KPIs Grid - Conectados ao DB com Empty States */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-500">Taxa de Acerto Média</CardTitle>
                <CheckCircle className="h-4 w-4 text-emerald-500" />
              </CardHeader>
              <CardContent>
                {statsLoading ? <Loader2 className="h-5 w-5 animate-spin text-slate-400 mt-1" /> : (
                  <>
                    <div className="text-2xl font-bold">{stats.taxaAcerto}</div>
                    <p className="text-xs text-slate-500 font-medium">{stats.totalQuestoes === 0 ? "Nenhum histórico disponível" : "Relativo aos simulados concluídos"}</p>
                  </>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-500">Questões Realizadas (Total)</CardTitle>
                <Activity className="h-4 w-4 text-indigo-500" />
              </CardHeader>
              <CardContent>
                {statsLoading ? <Loader2 className="h-5 w-5 animate-spin text-slate-400 mt-1" /> : (
                  <>
                    <div className="text-2xl font-bold">{stats.totalQuestoes}</div>
                    <p className="text-xs text-slate-500">{stats.totalQuestoes === 0 ? "Seu aprendizado começa hoje!" : "Sempre evoluindo..."}</p>
                  </>
                )}
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-500">Aderência ao Edital Alvo</CardTitle>
                <Target className="h-4 w-4 text-orange-500" />
              </CardHeader>
              <CardContent>
                {statsLoading ? <Loader2 className="h-5 w-5 animate-spin text-slate-400 mt-1" /> : (
                   <>
                     <div className="text-2xl font-bold">{stats.aderencia}</div>
                     <p className="text-xs text-slate-500">{stats.totalQuestoes === 0 ? "Gere seu primeiro Simulado" : "Cobrança estratégica"}</p>
                   </>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Gerador de Simulado Inteligente Avançado */}
          <Card className="border-2 border-primary/30 shadow-xl overflow-hidden shadow-primary/5">
            <div className="bg-primary/5 p-6 border-b border-primary/10">
              <CardTitle className="text-2xl flex items-center gap-2 text-primary">
                <Brain className="h-6 w-6" /> Gerador Inteligente com Gemini
              </CardTitle>
              <CardDescription className="text-base break-words mt-2">
                Configure a sua prova. Adicione múltiplas disciplinas e a IA vai forjar o cenário perfeito do seu edital.
              </CardDescription>
            </div>
            
            <CardContent className="p-8 space-y-8">
              <div className="space-y-3 max-w-sm">
                <label className="text-sm font-bold text-slate-700 uppercase tracking-wide">Banca da Prova</label>
                <Select value={banca} onValueChange={(val) => val && setBanca(val)}>
                  <SelectTrigger className="h-12 border-slate-300">
                    <SelectValue placeholder="Selecione a banca..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cebraspe">CEBRASPE (Cespe)</SelectItem>
                    <SelectItem value="fgv">FGV</SelectItem>
                    <SelectItem value="fcc">FCC</SelectItem>
                    <SelectItem value="vunesp">VUNESP</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-bold text-slate-700 uppercase tracking-wide">Disciplinas do Simulado</label>
                  <Button variant="outline" size="sm" onClick={addModulo} className="text-primary border-primary/20 hover:bg-primary/10">
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar Matéria
                  </Button>
                </div>
                
                <div className="space-y-3">
                  {modulos.map((modulo, idx) => (
                    <div key={idx} className="flex gap-4 items-center bg-slate-50 p-4 rounded-xl border border-slate-200">
                      <div className="flex-1 space-y-2">
                        <label className="text-xs font-semibold text-slate-500">Disciplina (Matéria)</label>
                        <Select 
                          value={modulo.disciplina} 
                          onValueChange={(val) => updateModulo(idx, "disciplina", val)}
                        >
                          <SelectTrigger className="bg-white border-slate-300">
                            <SelectValue placeholder="Escolha a disciplina..." />
                          </SelectTrigger>
                          <SelectContent>
                            {DISCIPLINAS_CONCURSO.map(d => (
                              <SelectItem key={d} value={d}>{d}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="w-32 space-y-2">
                        <label className="text-xs font-semibold text-slate-500">Qtd. Questões</label>
                        <Input 
                          type="number" 
                          min={1} max={30}
                          value={modulo.quantidade}
                          onChange={(e) => updateModulo(idx, "quantidade", parseInt(e.target.value) || 1)}
                          className="bg-white"
                        />
                      </div>
                      {modulos.length > 1 && (
                        <Button variant="ghost" size="icon" className="mt-6 text-red-400 hover:text-red-600 hover:bg-red-50" onClick={() => removeModulo(idx)}>
                          <Trash2 className="h-5 w-5" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
                
                {modulos.reduce((acc, curr) => acc + curr.quantidade, 0) > 15 && (
                   <p className="text-xs text-orange-600 flex items-center gap-1 font-medium bg-orange-50 p-2 rounded w-fit">
                    <Flame className="h-4 w-4" /> Alerta: Mais de 15 itens afetam o tempo do Gemini no modo gratuito.
                   </p>
                )}
                {limitReached && (
                   <p className="text-xs text-red-600 flex items-center gap-1 font-bold bg-red-50 p-2 rounded w-fit border border-red-200">
                    O Plano Iniciante é limitado a 15 questões por Simulado Inteligente. Reduza ou assine o VIP.
                   </p>
                )}
              </div>

            </CardContent>
            {errorMsg && (
              <div className="bg-red-50 text-red-800 p-4 border border-red-200 mt-0 text-sm font-semibold flex justify-between items-center">
                <span>⚠️ {errorMsg}</span>
                <Button variant="ghost" size="sm" onClick={() => setErrorMsg("")} className="text-red-800 hover:bg-red-100">Fechar</Button>
              </div>
            )}
            
            <div className="bg-slate-50 p-6 flex justify-end border-t border-slate-100">
              <Button 
                size="lg" 
                className="w-full md:w-auto text-base px-10 py-7 shadow-2xl shadow-primary/30 transition-all hover:scale-105 active:scale-95 bg-primary text-white"
                onClick={handleGenerate}
                disabled={loading || limitReached}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-3 h-6 w-6 animate-spin text-white/70" /> Forjando Questões na Mente da Banca...
                  </>
                ) : (
                  "✨ Iniciar Simulado Inédito"
                )}
              </Button>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}
