import { useSocket } from '@/context/SocketContext';
import { APISocket } from '@/services/SocketService';

export type UILogger = APISocket['logger'];

export const useLogger = () => {
  const socket = useSocket();
  return socket.logger;
};
