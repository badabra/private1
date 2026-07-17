import { Router } from 'express';
import { authRouter } from './authRoutes.js';
import { gamesRouter } from './gamesRoutes.js';
import { blogsRouter } from './blogsRoutes.js';
import { groupsRouter } from './groupsRoutes.js';
import { puzzlesRouter } from './puzzlesRoutes.js';

export const apiRouter = Router();

apiRouter.use('/auth', authRouter);
apiRouter.use('/games', gamesRouter);   // inclut le chat de partie (Sprint 3)
apiRouter.use('/blogs', blogsRouter);   // Sprint 3 - Communauté
apiRouter.use('/groups', groupsRouter); // Sprint 3 - Communauté
apiRouter.use('/puzzles', puzzlesRouter); // Sprint 3 - Communauté
