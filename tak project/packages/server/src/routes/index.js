import { Router } from 'express';
import { authRouter } from './authRoutes.js';
import { gamesRouter } from './gamesRoutes.js';

export const apiRouter = Router();

apiRouter.use('/auth', authRouter);
apiRouter.use('/games', gamesRouter);

// À ajouter aux sprints suivants :
// apiRouter.use('/blogs', blogsRouter);     // Sprint 3 - Communauté
// apiRouter.use('/groups', groupsRouter);   // Sprint 3 - Communauté
// apiRouter.use('/puzzles', puzzlesRouter); // Sprint 3 - Communauté
// apiRouter.use('/profiles', profilesRouter); // Sprint 2 - historique/stats
