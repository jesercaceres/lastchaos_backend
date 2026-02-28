import express from 'express';
import routes from './routes';
import { errorMiddleware } from './shared/middlewares/error.middleware'; // 1. Importamos o nosso middleware

const app = express();

app.use(express.json());

// As nossas rotas normais
app.use('/owlc', routes);

// MIDDLEWARE GLOBAL DE ERROS (Sempre no final da fila!)
app.use(errorMiddleware);

export default app;