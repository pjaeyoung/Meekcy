import app from './index';
import { debugHTTP } from './utils/debug';

/* Server Activation */
const server = app.listen(app.get('port'), () => {
	debugHTTP(`server listening on PORT ${app.get('port')}`);
});

export default server;
