import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { GoogleGenAI, Type, Schema } from '@google/genai';

// Initialize instances
const prisma = new PrismaClient();
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// The expected payload format from the frontend.
// body: {
//   banca: "cebraspe",
//   user_id: string, // optional for now, we'll mock if not provided
//   modulos: [
//     { disciplina: "Direito Constitucional", quantidade: 5 },
//     ...
//   ]
// }

import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.email) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json({ error: "Usuário não encontrado na base." }, { status: 404 });
    }

    const data = await request.json();
    const banca = data.banca || "FGV";
    const modulos = data.modulos || [{ disciplina: "Direito Administrativo", quantidade: 5 }];

    let questoesGeradas: any[] = [];
    
    // We will ask Gemini to generate questions for each mapped module.
    // Alternatively, we could do it in a single prompt for all disciplines, which is faster.
    const sysInstruction = `Você é um professor gênio especializado em criação de questões de concursos públicos do Brasil.
A banca examinadora solicitada é: ${banca.toUpperCase()}.
Aja como a banca. Imite estritamente seu vocabulário, nível de profundidade e estilo de enunciados.
Sua missão é criar um minisimulado inédito agrupando várias disciplinas.
RETORNE APENAS AS QUESTÕES SOLICITADAS. NENHUM TEXTO A MAIS.`;

    const disciplinasText = modulos.map((m: any) => `- ${m.quantidade} questões de ${m.disciplina}`).join("\n");
    const prompt = `Gere rigorosamente as seguintes questões inéditas para a banca ${banca}:
${disciplinasText}

Cada questão DEVE ter 5 alternativas (A, B, C, D, E). Mesmo se for Cebraspe Certo/Errado, adapte o modelo para ABCDE contendo a pegadinha.
Todas as questões necessitam de uma "explicacao_ia" extremamente detalhada, indicando jurisprudências, artigos de lei ou regras gramaticais relevantes que validam o gabarito.`;

    const responseSchema: Schema = {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          disciplina: { type: Type.STRING, description: "A disciplina EXATA da questão (ex: Direito Constitucional)" },
          enunciado: { type: Type.STRING },
          alternativas: {
            type: Type.OBJECT,
            properties: {
              A: { type: Type.STRING },
              B: { type: Type.STRING },
              C: { type: Type.STRING },
              D: { type: Type.STRING },
              E: { type: Type.STRING }
            },
            required: ["A", "B", "C", "D", "E"]
          },
          gabarito: { type: Type.STRING, description: "Somente a letra correta, ex: A, B, C, D ou E" },
          explicacao_ia: { type: Type.STRING }
        },
        required: ["disciplina", "enunciado", "alternativas", "gabarito", "explicacao_ia"]
      }
    };

    console.log("Calling Gemini API with modules:", modulos);

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-pro',
      contents: prompt,
      config: {
        systemInstruction: sysInstruction,
        responseMimeType: 'application/json',
        responseSchema: responseSchema,
        temperature: 0.7,
      }
    });

    const resultText = response.text;
    if (!resultText) throw new Error("A IA retornou vazio.");
    
    questoesGeradas = JSON.parse(resultText);

    let simulado = null;
    try {
      simulado = await prisma.simulado.create({
        data: {
          user_id: user.id,
          banca: banca,
          disciplinas: modulos.map((m: any) => m.disciplina),
          questoes: {
            create: questoesGeradas.map(q => ({
              disciplina: q.disciplina,
              enunciado: q.enunciado,
              alternativas: q.alternativas,
              gabarito: q.gabarito,
              explicacao_ia: q.explicacao_ia
            }))
          }
        },
        include: { questoes: true }
      });
    } catch (dbError) {
      console.warn("DB Failed, falling back to in-memory JSON", dbError);
      simulado = {
        id: "sim_fallback_" + Date.now(),
        banca: banca,
        disciplinas: modulos.map((m: any) => m.disciplina),
        questoes: questoesGeradas.map((q, i) => ({
          id: "q_" + i,
          ...q
        }))
      };
    }

    return NextResponse.json({
      success: true,
      simulado: simulado
    });

  } catch (error: any) {
    console.error("Erro na geração do simulado:", error);
    return NextResponse.json({ error: "Failed to generate simulado via IA", details: error.message }, { status: 500 });
  }
}
