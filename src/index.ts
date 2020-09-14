/* Required External Modules */

import express, { Request, Response } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import compression from 'compression';
import { createConnection } from 'typeorm';
import expressJWT from 'express-jwt';
import { debugHTTP, debugDB, debugERROR } from './utils/debug';
import configs from './common/config';
import router from './routes/index.route';

/* App Variables */
createConnection()
	.then(() => {
		debugDB('connection is success');
	})
	.catch((err) => debugERROR(err));

const corsOptions: cors.CorsOptions = {
	origin: configs.CLIENT_IP,
	methods: ['GET', 'POST', 'PATCH'],
	credentials: true,
};
const PORT: number = Number(process.env.PORT) || 4000;
const app: express.Application = express();

const {
	authRouter,
	avatarRouter,
	userRouter,
	videoRouter,
	roomRouter,
	videoHistoryRouter,
} = router;

/* App Configuration */
app.set('port', PORT);
app.use(compression());
app.use(express.json());
app.use(morgan('combined', { stream: { write: (msg) => debugHTTP(msg) } }));
app.use(cors(corsOptions));

app.use('/auth', authRouter);

const jwtMiddleware = expressJWT({
	secret: `${process.env.JWT_SECRET}`,
	algorithms: ['HS256'],
});

app.use('/avatars', jwtMiddleware, avatarRouter);
app.use('/user', jwtMiddleware, userRouter);
app.use('/videos', jwtMiddleware, videoRouter);
app.use('/rooms', jwtMiddleware, roomRouter);
app.use('/videoHistory', jwtMiddleware, videoHistoryRouter);

// not found handling
app.use((req: Request, res: Response) => {
	res.status(404).send('unvaild url');
});
// error handling
app.use((err: Error, req: Request, res: Response) => {
	debugERROR(err);
	res.sendStatus(500);
});

export default app;
