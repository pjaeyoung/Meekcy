import app from './index';
import debug from 'debug';

const debugHttp = debug('http');
/* Server Activation */
const server = app.listen(app.get('port'), () => {
	debugHttp(`server listening on PORT ${app.get('port')}`);
});

export default server;
