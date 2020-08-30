/* Required External Modules */

import express, { Request, Response } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import compression from 'compression';
import * as dotenv from 'dotenv';
import debug from 'debug';

dotenv.config();

/* App Variables */

const CLEINT_IP: string = process.env.CLEINT_IP || 'http://localhost:3000';
const corsOptions: cors.CorsOptions = {
	origin: [CLEINT_IP],
	methods: ['GET', 'POST', 'PATCH'],
	credentials: true,
};
const PORT: number = Number(process.env.PORT) || 4000;
const debugHttp = debug('http');
const app: express.Application = express();

/* App Configuration */
app.set('port', PORT);
app.use(compression());
app.use(express.json());
app.use(morgan('combined', { stream: { write: (msg) => debugHttp(msg) } }));
app.use(cors(corsOptions));

app.get('/', (req: Request, res: Response) => {
	res.send('Hello World!');
});

export default app;
