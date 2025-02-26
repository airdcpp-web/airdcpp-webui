import SocketService from '@/services/SocketService';

import * as API from '@/types/api';

export const sendChatMessageDecorator = (sessionUrl: string) => {
  return (sessionId: number, text: string, thirdPerson: boolean) => {
    return SocketService.post(`${sessionUrl}/${sessionId}/chat_message`, {
      text,
      third_person: thirdPerson,
    });
  };
};

export const sendStatusMessageDecorator = (sessionUrl: string) => {
  return (sessionId: number, text: string, severity: API.SeverityEnum) => {
    return SocketService.post(`${sessionUrl}/${sessionId}/status_message`, {
      text,
      severity,
    });
  };
};

export const fetchMessagesDecorator = (sessionUrl: string) => {
  return (sessionId: number) =>
    SocketService.get(`${sessionUrl}/${sessionId}/messages/0`);
};

export const setReadDecorator = (sessionUrl: string) => {
  return (sessionId: number) =>
    SocketService.post(`${sessionUrl}/${sessionId}/messages/read`);
};

export const clearMessagesDecorator = (sessionUrl: string) => {
  return (sessionId: number) =>
    SocketService.delete(`${sessionUrl}/${sessionId}/messages`);
};
