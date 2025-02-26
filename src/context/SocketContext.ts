import { createContext, useContext } from 'react';
import SocketService, { APISocket } from '@/services/SocketService';

export type SocketContextType = APISocket;
export const SocketContext = createContext<SocketContextType>(SocketService);

export const useSocket = () => {
  return useContext(SocketContext);
};
