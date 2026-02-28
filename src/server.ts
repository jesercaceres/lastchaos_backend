import app from './app';
import { env } from './config/env';

app.listen(env.PORT, () => {
    console.log(`🚀 Servidor rodando de forma segura na porta ${env.PORT}`);
});