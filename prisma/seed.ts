import { PrismaClient } from '@prisma/client'
import bcryptjs from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const commonPassword = await bcryptjs.hash('123456', 10);

  const users = [
    {
      nome: 'Testador Iniciante',
      email: 'iniciante@concursos.ai',
      senha: commonPassword,
      plano: 'iniciante',
    },
    {
      nome: 'Testador Aprovado',
      email: 'aprovado@concursos.ai',
      senha: commonPassword,
      plano: 'aprovado',
    },
    {
      nome: 'Testador Elite IA',
      email: 'elite@concursos.ai',
      senha: commonPassword,
      plano: 'elite',
    }
  ];

  for (const u of users) {
    const user = await prisma.user.upsert({
      where: { email: u.email },
      update: { plano: u.plano, senha: u.senha },
      create: {
        email: u.email,
        nome: u.nome,
        senha: u.senha,
        plano: u.plano,
      },
    });
    console.log(`Created/Updated user with id: ${user.id} and plano: ${user.plano}`);
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
