/* Required External Modules*/
import express from 'express';
import videoController from '../controllers/video.controller';

/* Router Definition */
export const videoRouter = express.Router();

/* Router and Controller Connection*/

// GET videos/
videoRouter.get('/', videoController.getAll);

// GET videos/watched
videoRouter.get('/watched', videoController.getWatched);
