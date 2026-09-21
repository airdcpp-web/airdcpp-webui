import { APISocket } from '@/services/SocketService';

export const clearMessagesDecorator = (sessionUrl: string) => {
  return (sessionId: number, socket: APISocket) =>
    socket.delete(`${sessionUrl}/${sessionId}/messages`);
};
