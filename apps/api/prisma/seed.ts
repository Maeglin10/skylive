import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash('Password123!', 12);

  const creatorUser = await prisma.user.upsert({
    where: { email: 'creator@skylive.dev' },
    update: {},
    create: {
      email: 'creator@skylive.dev',
      passwordHash,
      displayName: 'Creator One',
      role: 'CREATOR',
    },
  });

  const viewerUser = await prisma.user.upsert({
    where: { email: 'viewer@skylive.dev' },
    update: {},
    create: {
      email: 'viewer@skylive.dev',
      passwordHash,
      displayName: 'Viewer One',
      role: 'VIEWER',
    },
  });

  const creator = await prisma.creator.upsert({
    where: { userId: creatorUser.id },
    update: {},
    create: {
      userId: creatorUser.id,
      username: 'creator_one',
      bio: 'Seeded creator profile',
      subscriptionPrice: 990,
    },
  });

  await prisma.content.upsert({
    where: { id: 'seed-free-content' },
    update: {},
    create: {
      id: 'seed-free-content',
      creatorId: creator.id,
      type: 'POST',
      text: 'Hello, this is a free seeded post.',
      accessRule: 'FREE',
    },
  });

  await prisma.content.upsert({
    where: { id: 'seed-ppv-content' },
    update: {},
    create: {
      id: 'seed-ppv-content',
      creatorId: creator.id,
      type: 'POST',
      text: 'This is a PPV seeded post.',
      accessRule: 'PPV',
      price: 500,
    },
  });

  await prisma.liveSession.upsert({
    where: { id: 'seed-live-session' },
    update: {},
    create: {
      id: 'seed-live-session',
      creatorId: creator.id,
      title: 'Seeded Live Session',
      status: 'OFFLINE',
      streamKey: 'seed-stream-key',
      accessRule: 'PPV',
      price: 700,
    },
  });

  await prisma.subscription.upsert({
    where: { userId_creatorId: { userId: viewerUser.id, creatorId: creator.id } },
    update: {},
    create: {
      userId: viewerUser.id,
      creatorId: creator.id,
      status: 'ACTIVE',
    },
  });
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
