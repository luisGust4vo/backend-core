import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const permissions = ['create_user', 'delete_user', 'view_dashboard'];

  for (const name of permissions) {
    await prisma.permission.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }

  const admin = await prisma.role.findUnique({ where: { name: 'admin' } });
  const allPermissions = await prisma.permission.findMany();

  for (const permission of allPermissions) {
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
}

main().finally(() => prisma.$disconnect());
