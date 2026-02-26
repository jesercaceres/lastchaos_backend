// src/server.ts
import express from 'express';
import { authRoutes } from './modules/auth/auth.routes';

const app = express();
app.use(express.json());


app.use('/owlc/auth', authRoutes); 

app.listen(3000, () => console.log('🚀 Servidor rodando na porta 3000'));