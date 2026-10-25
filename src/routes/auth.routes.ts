import express, { type Request, type Response } from 'express';

const router = express.Router();
import { createUserHandler } from '../controllers/auth.controller';

router.post('/register', createUserHandler);

export default router;
