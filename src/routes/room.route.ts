/* Required External Modules*/
import express from 'express';
import roomController from '../controllers/room.controller';

/* Router Definition */
export const roomRouter = express.Router();

/* Router and Controller Connection*/

// POST /rooms
roomRouter.post('/', roomController.post);
