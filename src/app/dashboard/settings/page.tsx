"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Loader2, ArrowLeft, UserCircle, Mail, ShieldCheck, Settings, CreditCard, Brain, CheckCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Link from "next/link";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useState } from "react";

export default function SettingsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [bancaFav, setBancaFav] = useState("cebraspe");

  if (status === "loading") {
    return <div className="min-h-screen flex items-center justify-center bg-slate-50"><Loader2 className="animate-spin text-primary h-8 w-8" /></div>;
  }

  if (status === "unauthenticated" || !session) {
    router.push("/login");
    return null;
  }

  // @ts-ignore
  const plano = (session?.user?.plano as string) || "iniciante";

  return (
    <div className="flex h-screen w-full bg-slate-50 text-slate-900 overflow-hidden font-sans">
      <main className="flex-1 flex flex-col h-full overflow-y-auto relative">
        {/* Header Compacto */}
        <header className="bg-white/80 backdrop-blur-md border-b px-8 py-4 flex items-center justify-between sticky top-0 z-20 shadow-sm">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-slate-400 hover:text-primary transition-colors">
              <ArrowLeft className="h-6 w-6" />
            </Link>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
              <Settings className="h-5 w-5 text-slate-500" /> Configurações da Conta
            </h1>
          </div>
        </header>

        <div className="flex-1 p-8 max-w-4xl w-full mx-auto space-y-8 pb-32">
          
          <div className="flex items-center gap-6 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
             <Avatar className="h-20 w-20 border-4 border-slate-50 shadow-md">
                <AvatarFallback className="bg-primary/10 text-primary text-2xl font-black">
                  {session.user?.name?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-2xl font-bold text-slate-900">{session.user?.name}</h2>
                <p className="text-slate-500 flex items-center gap-2 mt-1">
                  <Mail className="h-4 w-4" /> {session.user?.email}
                </p>
              </div>
              <div className="ml-auto flex flex-col gap-2 items-end">
                 {plano === 'elite' && <Badge className="bg-slate-900 text-yellow-500 text-sm py-1 px-3">Plano Elite IA</Badge>}
                 {plano === 'aprovado' && <Badge className="bg-primary text-sm py-1 px-3">Plano Aprovado</Badge>}
                 {plano === 'iniciante' && <Badge variant="outline" className="text-slate-500 border-slate-300 text-sm py-1 px-3">Plano Iniciante Livre</Badge>}
              </div>
          </div>

          <Tabs defaultValue="perfil" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8 bg-slate-100 p-1 rounded-xl">
              <TabsTrigger value="perfil" className="rounded-lg py-2.5 data-[state=active]:shadow-sm">Perfil Pessoal</TabsTrigger>
              <TabsTrigger value="preferencias" className="rounded-lg py-2.5 data-[state=active]:shadow-sm">Preferências IA</TabsTrigger>
              <TabsTrigger value="faturamento" className="rounded-lg py-2.5 data-[state=active]:shadow-sm">Faturamento</TabsTrigger>
            </TabsList>
            
            <TabsContent value="perfil" className="mt-0">
              <Card className="border-slate-200 shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><UserCircle className="h-5 w-5 text-primary"/> Dados de Identificação</CardTitle>
                  <CardDescription>
                    Informações atreladas à sua autenticação segura (NextAuth). Para alterar o e-mail, contate o suporte.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-600">Nome Oficial</label>
                    <Input value={session.user?.name || ""} disabled className="bg-slate-50 border-slate-200 text-slate-700 font-medium" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-600 flex items-center justify-between">
                      <span>E-mail de Acesso</span>
                      <span className="text-emerald-600 text-xs flex items-center gap-1 font-bold"><ShieldCheck className="h-3 w-3" /> Verificado</span>
                    </label>
                    <Input value={session.user?.email || ""} disabled className="bg-slate-50 border-slate-200 text-slate-700" />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="preferencias" className="mt-0">
               <Card className="border-slate-200 shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><Brain className="h-5 w-5 text-purple-600"/> Preferências do Gerador</CardTitle>
                  <CardDescription>
                    Poupe tempo pré-configurando a banca que você mais utiliza nos seus simulados.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-3 max-w-sm">
                    <label className="text-sm font-bold text-slate-700">Banca Padrão Favorita</label>
                    <Select value={bancaFav} onValueChange={(val) => val && setBancaFav(val)}>
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
                    <p className="text-xs text-slate-500">Ao entrar na Dashboard, essa banca virá pré-selecionada.</p>
                  </div>
                  
                  <Button className="mt-4 bg-primary text-white font-semibold">
                    Salvar Preferências <CheckCircle className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="faturamento" className="mt-0">
               <Card className="border-slate-200 shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><CreditCard className="h-5 w-5 text-emerald-600"/> Resumo da Assinatura</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-slate-800 text-lg uppercase tracking-wide">Plano Atual: {plano}</h4>
                      <p className="text-sm text-slate-500 mt-1">
                        {plano === 'iniciante' ? "Você possui um limite de 15 questões inéditas por simulado Gemini." : "Acesso irrestrito a simulações de alto nível."}
                      </p>
                    </div>
                    {plano === 'iniciante' && (
                       <Link href="/pricing" className="bg-slate-900 text-white px-6 py-2 rounded-lg font-bold hover:bg-slate-800 transition-colors shadow-md">
                         Assinar VIP
                       </Link>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
