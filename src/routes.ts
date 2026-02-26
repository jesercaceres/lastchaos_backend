import { Router } from 'express';
import { authRoutes } from './modules/auth/auth.routes';
// No futuro, importará os outros aqui:
// import { characterRoutes } from './modules/characters/character.routes';

const routes = Router();

// Todas as rotas de auth ficam debaixo do caminho /auth
routes.use('/auth', authRoutes);

// routes.use('/characters', characterRoutes);
// routes.use('/guilds', guildRoutes);

export default routes;