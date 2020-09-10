import server from './socket';
import { debugHTTP } from './utils/debug';
/* Server Activation */
server.listen(4000, () => {
	debugHTTP('server listening on PORT 4000');
});
