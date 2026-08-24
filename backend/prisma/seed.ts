import { PrismaClient, Role, TransactionType } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Memulai seed database...');

  const passwordHash = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@masjid.local' },
    update: {},
    create: {
      name: 'Super Admin',
      email: 'admin@masjid.local',
      passwordHash,
      role: Role.SUPER_ADMIN,
    },
  });

  const bendaharaPassword = await bcrypt.hash('bendahara123', 10);
  await prisma.user.upsert({
    where: { email: 'bendahara@masjid.local' },
    update: {},
    create: {
      name: 'Bendahara Masjid Sayyidina Abubakar',
      email: 'bendahara@masjid.local',
      passwordHash: bendaharaPassword,
      role: Role.BENDAHARA,
    },
  });

  const kategoriPemasukan = [
    { name: 'Infaq', description: 'Infaq jamaah' },
    { name: 'Sedekah', description: 'Sedekah umum' },
    { name: 'Zakat', description: 'Zakat mal & fitrah' },
    { name: 'Donasi', description: 'Donasi khusus' },
    { name: 'Kotak Amal', description: 'Kotak amal jumat' },
  ];

  const kategoriPengeluaran = [
    { name: 'Operasional', description: 'Listrik, air, kebersihan' },
    { name: 'Pemeliharaan', description: 'Perawatan gedung & peralatan' },
    { name: 'Kegiatan', description: 'Kegiatan keagamaan' },
    { name: 'Honor Ustadz', description: 'Honor pengajar & imam' },
    { name: 'Sosial', description: 'Bantuan sosial' },
  ];

  for (const k of kategoriPemasukan) {
    await prisma.category.upsert({
      where: { name_type: { name: k.name, type: TransactionType.PEMASUKAN } },
      update: {},
      create: { ...k, type: TransactionType.PEMASUKAN },
    });
  }

  for (const k of kategoriPengeluaran) {
    await prisma.category.upsert({
      where: { name_type: { name: k.name, type: TransactionType.PENGELUARAN } },
      update: {},
      create: { ...k, type: TransactionType.PENGELUARAN },
    });
  }

  const infaq = await prisma.category.findFirst({
    where: { name: 'Infaq', type: TransactionType.PEMASUKAN },
  });
  const operasional = await prisma.category.findFirst({
    where: { name: 'Operasional', type: TransactionType.PENGELUARAN },
  });

  if (infaq && operasional) {
    await prisma.transaction.createMany({
      data: [
        {
          type: TransactionType.PEMASUKAN,
          amount: 500000,
          description: 'Infaq jumat',
          categoryId: infaq.id,
          createdById: admin.id,
        },
        {
          type: TransactionType.PENGELUARAN,
          amount: 150000,
          description: 'Bayar listrik',
          categoryId: operasional.id,
          createdById: admin.id,
        },
      ],
    });
  }

  console.log('✅ Seed selesai. Login: admin@masjid.local / admin123');
}

main()
  .catch((e) => {
    console.error('❌ Gagal seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
