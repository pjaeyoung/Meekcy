import SocketIO from 'socket.io';
import server from './server';

const io = SocketIO(server);
