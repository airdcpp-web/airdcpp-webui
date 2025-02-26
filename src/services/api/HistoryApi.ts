import { APISocket } from '@/services/SocketService';
import HistoryConstants from '@/constants/HistoryConstants';

export const addHistory = (socket: APISocket, historyId: string, text: string) => {
  return socket.post(`${HistoryConstants.STRINGS_URL}/${historyId}`, {
    string: text,
  });
};
