import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { listPosts, createPost, getPost, addComment } from '../controllers/blogsController.js';

export const blogsRouter = Router();

// Lecture publique, écriture (article + commentaire) réservée aux connectés.
blogsRouter.get('/', asyncHandler(listPosts));
blogsRouter.post('/', requireAuth, asyncHandler(createPost));
blogsRouter.get('/:id', asyncHandler(getPost));
blogsRouter.post('/:id/comments', requireAuth, asyncHandler(addComment));
