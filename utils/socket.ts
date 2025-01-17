import {io, Socket} from 'socket.io-client';

const SOCKET_SERVER_URL = 'http://your-server-url:port';

const createSocket = (): Socket => {
  return io(SOCKET_SERVER_URL);
};

export default createSocket;
