/* Required External Modules*/
import express from 'express';
import videoController from '../controllers/videoHistory.controller';

/* Router Definition */
export const videoHistoryRouter = express.Router();

/* Router and Controller Connection*/

// POST videoHistory/
videoHistoryRouter.post('/', videoController.post);
