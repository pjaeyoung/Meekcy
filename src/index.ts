/* Required External Modules */

import express, { Request, Response } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import compression from 'compression';
import { createConnection } from 'typeorm';
import expressJWT from 'express-jwt';
import { debugHTTP, debugDB, debugERROR } from './utils/debug';
import { authRouter } from './routes/auth.route';
import configs from './common/config';

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

/* App Configuration */
app.set('port', PORT);
app.use(compression());
app.use(express.json());
app.use(morgan('combined', { stream: { write: (msg) => debugHTTP(msg) } }));
app.use(cors(corsOptions));

app.use('/auth', authRouter);
app.use(
	expressJWT({
		secret: `${process.env.JWT_SECRET}`,
		algorithms: ['HS256'],
	}),
);

// not found handling
app.use((req: Request, res: Response) => {
	res.status(404).send('unvaild url');
});
// error handling
app.use((err: Error, req: Request, res: Response) => {
	if (err.name === 'UnauthorizedError') {
		res.status(401).send(err);
	} else {
		res.sendStatus(500);
	}
});

export default app;