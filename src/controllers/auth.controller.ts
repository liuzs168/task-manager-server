import { Request, Response } from 'express';
import { AppError } from '@/lib/errors';
import { createUser } from '@/services/auth.service';

export const createUserHandler = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw AppError.badRequest('email 和 password 不能为空');
  }
  const user = await createUser(email, password);
  res.status(201).json(user);
};
