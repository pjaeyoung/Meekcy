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

// mysql과 연결
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

// client에서 요청 헤더 Authorization에 입력한 token값을 decode하여 request에 user 프로퍼티로 할당해주는 미들웨어
// 이 미들웨어를 거치고 나면 각 라우트에서 request.user 형태로 token값을 접근할 수 있다.
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
