import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcryptjs from 'bcryptjs';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { nome, email, senha } = await request.json();
    if (!nome || !email || !senha) {
      return NextResponse.json({ error: "Preencha todos os campos." }, { status: 400 });
    }
    
    // Check if user already exists
    const userExists = await prisma.user.findUnique({ where: { email } });
    if (userExists) {
      return NextResponse.json({ error: "Este e-mail já está em uso." }, { status: 400 });
    }

    const hashed = await bcryptjs.hash(senha, 10);
    const user = await prisma.user.create({
      data: {
        nome,
        email,
        senha: hashed,
        plano: "iniciante"
      }
    });

    return NextResponse.json({ success: true, user: { id: user.id, email: user.email }});
  } catch (error) {
    console.error("Register Error:", error);
    return NextResponse.json({ error: "Falha na criação da conta." }, { status: 500 });
  }
}
