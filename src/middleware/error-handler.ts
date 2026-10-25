import type { NextFunction, Request, Response } from 'express';
import { AppError } from '@/lib/errors';
import { Prisma } from '@/generated/prisma/client';

// 类型收窄:判断是否为 body-parser 的 JSON 解析错误(上次遇到的那个)
function isJsonParseError(err: unknown): boolean {
  return (
    typeof err === 'object' &&
    err !== null &&
    'type' in err &&
    (err as { type?: string }).type === 'entity.parse.failed'
  );
}

export function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  _next: NextFunction, // 必须保留 4 个参数,Express 靠参数个数识别错误中间件
) {
  // 1. 业务错误:直接按定义的状态码返回
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      error: {
        code: err.code,
        message: err.message,
      },
    });
  }

  // 2. 请求体不是合法 JSON → 400
  if (isJsonParseError(err)) {
    return res.status(400).json({
      error: { code: 'VALIDATION_ERROR', message: '请求体不是合法的 JSON' },
    });
  }

  // 3. Prisma 唯一约束冲突(并发重复注册的最终保障)→ 409
  if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
    return res.status(409).json({
      error: { code: 'CONFLICT', message: '邮箱已被注册' },
    });
  }

  // 4. 未知错误:服务端记完整日志,客户端只拿通用 500,不泄露堆栈/SQL
  console.error(`[${req.method}] ${req.originalUrl} →`, err);
  return res.status(500).json({
    error: { code: 'INTERNAL_SERVER_ERROR', message: '服务器内部错误' },
  });
}
