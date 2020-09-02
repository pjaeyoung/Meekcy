/* Required External Modules*/
import express from 'express';
import userProflieController from '../controllers/userProfile.controller';

/* Router Definition */
export const userRouter = express.Router();

/* Router and Controller Connection*/

// PATCH /user/profile
userRouter.patch('/profile', userProflieController.patch);
