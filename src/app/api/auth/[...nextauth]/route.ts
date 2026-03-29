import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcryptjs from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

import { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        senha: { label: "Senha", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.senha) {
          throw new Error("Preencha todos os campos.");
        }
        const user = await prisma.user.findUnique({ where: { email: credentials.email } });
        if (!user || !user.senha) {
          throw new Error("Credenciais inválidas.");
        }
        const match = await bcryptjs.compare(credentials.senha, user.senha);
        if (!match) {
          throw new Error("Senha ou E-mail incorretos.");
        }
        return {
          id: user.id,
          name: user.nome,
          email: user.email,
          plano: user.plano
        };
      }
    })
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        // @ts-ignore
        token.plano = user.plano;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        // @ts-ignore
        session.user.plano = token.plano;
      }
      return session;
    }
  },
  secret: process.env.NEXTAUTH_SECRET || "fallback_secret_for_local_dev_12345",
  pages: {
    signIn: "/login",
  }
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
