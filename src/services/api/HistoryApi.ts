import SocketService from 'services/SocketService';
import HistoryConstants from 'constants/HistoryConstants';

export const addHistory = (historyId: string, text: string) => {
  return SocketService.post(`${HistoryConstants.STRINGS_URL}/${historyId}`, {
    string: text,
  });
};
