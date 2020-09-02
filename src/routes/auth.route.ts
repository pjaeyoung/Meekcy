/* Required External Modules*/
import express from 'express';
import authController from '../controllers/auth.controller';

/* Router Definition */
export const authRouter = express.Router();

/* Router and Controller Connection*/

// POST auth/
authRouter.post('/', authController.post);
