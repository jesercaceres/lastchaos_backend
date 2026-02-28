import dotenv from 'dotenv';
import { z } from 'zod';

// 1. Lê o ficheiro .env na raiz do projeto
dotenv.config();

// 2. Define o formato obrigatório das nossas variáveis de ambiente usando Zod
const envSchema = z.object({
    PORT: z.string().default('3000'), // Porta padrão 3000 se não for definida
    JWT_SECRET: z.string().min(10,'O JWT_SECRET no .env é obrigatório e deve ser seguro.'),
    DATABASE_URL: z.string().url('A DATABASE_URL é obrigatória e deve ser uma URL válida.')
});

// 3. Valida os dados reais contra o nosso esquema
const _env = envSchema.safeParse(process.env);

if (!_env.success) {
    console.error('❌ ERRO CRÍTICO: Variáveis de ambiente inválidas ou ausentes:');
    console.error(_env.error.format());
    process.exit(1); // Desliga o servidor imediatamente (Fail-Fast)
}

// 4. Exporta as variáveis seguras e tipadas
export const env = _env.data;