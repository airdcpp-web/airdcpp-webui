import SocketService from 'services/SocketService';

import * as API from 'types/api';
import PrivateChatConstants from 'constants/PrivateChatConstants';


export const changePrivateChatHubUrl = (
  session: API.PrivateChat, 
  hubUrl: string
) => {
  SocketService.patch(PrivateChatConstants.SESSIONS_URL + '/' + session.id, { 
    hub_url: hubUrl 
  });
};