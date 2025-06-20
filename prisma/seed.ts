import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log('Iniciando seed...');

  const roles = ['admin', 'gerente', 'usuario'];
  const permissions = ['create_user', 'delete_user', 'view_reports'];

  console.log('Criando roles...');
  for (const roleName of roles) {
    console.log(`Upsert role: ${roleName}`);
    await prisma.role.upsert({
      where: { name: roleName },
      update: {},
      create: { name: roleName },
    });
  }

  console.log('📌 Criando permissions...');
  for (const permName of permissions) {
    console.log(`🛠️  Upsert permission: ${permName}`);
    await prisma.permission.upsert({
      where: { name: permName },
      update: {},
      create: { name: permName },
    });
  }

  console.log('🔍 Buscando role admin...');
  const admin = await prisma.role.findUnique({
    where: { name: 'admin' },
  });

  if (!admin) {
    throw new Error('❌ Role "admin" não foi encontrada!');
  }

  console.log(`✅ Admin encontrado (ID: ${admin.id})`);

  console.log('📋 Buscando todas as permissions...');
  const allPermissions = await prisma.permission.findMany();

  console.log('🔗 Relacionando permissões ao admin...');
  for (const permission of allPermissions) {
    console.log(`➡️  Ligando admin ao permission: ${permission.name}`);

    await prisma.rolePermission.upsert({
      where: {
        roleId_permissionId: {
          roleId: admin.id,
          permissionId: permission.id,
        },
      },
      update: {},
      create: {
        roleId: admin.id,
        permissionId: permission.id,
      },
    });
  }

  console.log('✅ Seed finalizado com sucesso!');
}

main()
  .then(async () => {
    await prisma.$disconnect();
    process.exit(0);
  })
  .catch(async (e) => {
    console.error('❌ Erro durante o seed:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
