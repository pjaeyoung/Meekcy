/* Required External Modules*/
import express from 'express';
import avatarController from '../controllers/avatar.controller';

/* Router Definition */
export const avatarRouter = express.Router();

/* Router and Controller Connection*/

// GET avatars/
avatarRouter.get('/', avatarController.get);
