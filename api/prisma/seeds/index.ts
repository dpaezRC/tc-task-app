import bcrypt from 'bcrypt';
import { PrismaClient, TaskStatus } from '@prisma/client';

const prisma = new PrismaClient();

const log = {
  success: (value: string) => console.log(`\n\x1b[32m${value}\x1b[0m`),
  error: (value: string | Error) => console.error(`\n\x1b[31m${value}\x1b[0m`),
  info: (value: string) => console.log(`\n\x1b[34m${value}\x1b[0m`),
};

async function seedData(seedName: string, seedFn: () => Promise<void>) {
  try {
    await seedFn();
    log.success('- Seeded ' + seedName);
  } catch (error) {
    log.error('- Error seeding ' + seedName);
    throw error;
  }
}

async function seedUsers() {
  const password = await bcrypt.hash('123456', 10);

  const user = await prisma.user.upsert({
    where: { email: 'user@tasks.com' },
    update: {},
    create: {
      firstName: 'Test',
      lastName: 'User',
      email: 'user@tasks.com',
      password,
      isActive: true,
    },
  });

  await prisma.task.createMany({
    data: [
      {
        title: 'Diseñar el modelo de datos',
        description: 'Definir entidades y relaciones en Prisma',
        status: TaskStatus.DONE,
        userId: user.id,
      },
      {
        title: 'Implementar autenticación',
        description: 'Login, logout y cambio de contraseña',
        status: TaskStatus.IN_PROGRESS,
        userId: user.id,
      },
      {
        title: 'Escribir documentación',
        description: 'README y Swagger',
        status: TaskStatus.PENDING,
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        userId: user.id,
      },
    ],
    skipDuplicates: true,
  });
}

const SEED_LIST_COMMAND = 'list';
const SEED_COMMANDS: Record<string, () => Promise<void>> = {
  users: seedUsers,
};

async function executeSeedCommand(command: string) {
  if (command === SEED_LIST_COMMAND) {
    log.info('- Available seed commands:\n');
    Object.keys(SEED_COMMANDS).forEach((command) => {
      log.info(`* ${command}`);
    });
    return;
  }

  const isValidSeed = Object.keys(SEED_COMMANDS).includes(command);
  if (!isValidSeed) throw new Error(`Seed '${command}' does not exist`);

  log.success('Seeding started...');
  await seedData(command, SEED_COMMANDS[command]);
  log.success('Seeding completed successfully!');
}

async function main(): Promise<void> {
  try {
    const seedCommand = process.argv[2];
    if (seedCommand) return await executeSeedCommand(seedCommand);

    log.success('Seeding started...');
    for (const [name, fn] of Object.entries(SEED_COMMANDS)) {
      await seedData(name, fn);
    }
    log.success('Seeding completed successfully!');
  } catch (error) {
    log.error(error as Error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

void main();
