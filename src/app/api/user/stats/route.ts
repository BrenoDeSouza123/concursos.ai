import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { PrismaClient } from '@prisma/client';
import { authOptions } from '../../auth/[...nextauth]/route';

const prisma = new PrismaClient();

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user || !session.user.email) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });
    }

    // Calcular estatísticas agregadas (Empty State ou Totais Reais)
    const simulados = await prisma.simulado.findMany({
      where: { user_id: user.id },
      select: { score: true }
    });

    const totalSimulados = simulados.length;
    const simuladosAvaliados = simulados.filter(s => s.score !== null);
    
    // Taxa de Acerto (Média dos scores convertida para %, assumindo que cada score seja de 0-100 ou proporcional)
    // Se o score não é porcentagem ainda, no banco ele é um int, assumiremos que é o % de acerto vindo do front.
    let taxaAcerto = 0;
    if (simuladosAvaliados.length > 0) {
      const soma = simuladosAvaliados.reduce((acc, curr) => acc + (curr.score || 0), 0);
      taxaAcerto = Math.round(soma / simuladosAvaliados.length);
    }

    // Total de questões atreladas a todos os simulados do usuário
    const totalQuestoes = await prisma.questao.count({
      where: { simulado: { user_id: user.id } }
    });

    // Aderência ao Edital (Mock dinâmico baseado no uso ou zerado inicialmente)
    const aderencia = totalSimulados > 0 ? Math.min(100, (totalQuestoes * 2.5)) : 0;

    return NextResponse.json({
      success: true,
      stats: {
        taxaAcerto: `${taxaAcerto}%`,
        totalQuestoes,
        totalSimulados,
        aderencia: `${Math.round(aderencia)}%`
      }
    });

  } catch (error: any) {
    console.error('Erro ao buscar stats:', error);
    return NextResponse.json({ error: 'Falha interna' }, { status: 500 });
  }
}
