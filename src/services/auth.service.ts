import { AppError } from '@/lib/errors';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export const createUser = async (email: string, password: string) => {
  // 规范化邮箱:去首尾空格 + 转小写
  const normalizedEmail = email.trim().toLowerCase();

  // 检查邮箱是否已被注册
  const exiting = await prisma.user.findUnique({
    where: {
      email: normalizedEmail,
    },
  });
  if (exiting) {
    throw AppError.conflict('邮箱已被注册');
  }

  // 密码加密，使用 bcrypt 库加密
  const passwordHash = await bcrypt.hash(password, 10);

  return prisma.user.create({
    data: {
      email: normalizedEmail,
      password: passwordHash,
    },
    select: {
      id: true,
      email: true,
      createdAt: true,
    }, // 只返回 id, email, createdAt 字段
  });
};
