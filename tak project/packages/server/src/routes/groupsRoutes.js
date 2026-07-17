import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import {
  listGroups,
  createGroup,
  getGroup,
  joinGroup,
  leaveGroup,
} from '../controllers/groupsController.js';

export const groupsRouter = Router();

groupsRouter.get('/', asyncHandler(listGroups));
groupsRouter.post('/', requireAuth, asyncHandler(createGroup));
groupsRouter.get('/:id', asyncHandler(getGroup));
groupsRouter.post('/:id/join', requireAuth, asyncHandler(joinGroup));
groupsRouter.post('/:id/leave', requireAuth, asyncHandler(leaveGroup));
