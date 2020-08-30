import app from './index';
import debug from 'debug';

const httpDebug = debug('http');
/* Server Activation */
const server = app.listen(app.get('port'), () => {
	httpDebug(`server listening on PORT ${app.get('port')}`);
});

export default server;
