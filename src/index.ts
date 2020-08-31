/* Required External Modules */

import express, { Request, Response } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import compression from 'compression';
import * as dotenv from 'dotenv';
import { createConnection } from 'typeorm';
import { debugHTTP, debugDB, debugERROR } from './utils/debug';

dotenv.config();

/* App Variables */
createConnection()
	.then(() => {
		debugDB('connection is success');
	})
	.catch((err) => debugERROR(err));

const CLEINT_IP: string = process.env.CLEINT_IP || 'http://localhost:3000';
const corsOptions: cors.CorsOptions = {
	origin: [CLEINT_IP],
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

app.get('/', (req: Request, res: Response) => {
	res.send('Hello World!');
});

export default app;
