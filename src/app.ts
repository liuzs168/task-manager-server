import express, { type Express, type Request, type Response } from 'express';
import { notFoundHandler } from '@/middleware/not-found';
import { errorHandler } from '@/middleware/error-handler';

const app: Express = express();

// 解析请求体中间件
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 引入认证路由
import authRouter from './routes/auth.routes';
app.use('/auth', authRouter);

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});

// 404 必须在所有路由之后
app.use(notFoundHandler);

// 错误处理器必须是最后一个中间件
app.use(errorHandler);
export default app;
