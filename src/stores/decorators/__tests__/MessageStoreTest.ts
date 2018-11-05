import { checkUnreadSessionInfo } from 'utils/MessageUtils';
import PrivateChatActions from 'actions/PrivateChatActions';
import PrivateChatMessageStore from 'stores/PrivateChatMessageStore';

import * as API from 'types/api';
import * as UI from 'types/ui';


const SESSION_ID = 0;
const SESSION_BASE = {
  id: SESSION_ID,
};

const ChatMessage0 = {
  id: 0,
};

const StatusMessage1 = {
  id: 1,
};

const messages = [
  {
    chat_message: ChatMessage0,
  }, 
  {
    log_message: StatusMessage1,
  }
];

const clearMessages = () => {
  PrivateChatMessageStore._onSessionUpdated(
    {
      message_counts: {
        total: 0,
        unread: {
          bot: 0,
          user: 0,
          status: 0,
        }
      }
    } as UI.UnreadInfo,
    SESSION_ID,
  );
};


describe('message store', () => {
  jest.useFakeTimers();
  afterEach(() => {
    clearMessages();
  });

  test('should add individual messages', () => {
    PrivateChatMessageStore._onChatMessage(ChatMessage0, SESSION_ID);
    PrivateChatMessageStore._onStatusMessage(StatusMessage1, SESSION_ID);

    expect(PrivateChatMessageStore.getSessionMessages(SESSION_ID)).toEqual(messages);
  });

  test('should clear messages', () => {
    PrivateChatMessageStore._onStatusMessage(StatusMessage1, SESSION_ID);

    clearMessages();

    expect(PrivateChatMessageStore.getSessionMessages(SESSION_ID).length).toEqual(0);
  });

  test('should reset unread counts for active sessions', () => {
    const sessionData = {
      message_counts: {
        total: 5,
        unread: {
          user: 1,
          bot: 1,
          status: 1,
        }
      },
    };

    const setRead = jest.fn();

    const data = checkUnreadSessionInfo(sessionData, setRead);

    expect(setRead).toBeCalled();
    expect(data).toEqual({
      message_counts: {
        total: 5,
        unread: {
          user: 0,
          bot: 0,
          status: 0,
        }
      },
    });
  });

  test('should handle messages received during fetching', () => {
    const ChatMessage2 = {
      id: 2,
    } as API.ChatMessage;

    PrivateChatMessageStore._onStatusMessage(StatusMessage1, SESSION_ID);
    PrivateChatMessageStore._onChatMessage(ChatMessage2, SESSION_ID);

    PrivateChatActions.fetchMessages.completed(SESSION_BASE, messages);
    jest.runAllTimers();

    // All three messages should have been stored
    expect(PrivateChatMessageStore.getSessionMessages(SESSION_ID)).toEqual([
      ...messages,
      {
        chat_message: ChatMessage2,
      }
    ]);
  });

  test('should remove duplicates arriving after fetching', () => {
    PrivateChatActions.fetchMessages.completed(SESSION_BASE, messages);
    jest.runAllTimers();

    PrivateChatMessageStore._onStatusMessage(StatusMessage1, SESSION_ID);

    expect(PrivateChatMessageStore.getSessionMessages(SESSION_ID)).toEqual(messages);
  });

  test('should remove session data', () => {
    PrivateChatActions.fetchMessages.completed(SESSION_BASE, messages);
    jest.runAllTimers();

    expect(PrivateChatMessageStore.isSessionInitialized(SESSION_ID));
    expect(PrivateChatMessageStore.getSessionMessages(SESSION_ID)).toEqual(messages);

    PrivateChatMessageStore._onSessionRemoved({
      id: SESSION_ID,
    });

    expect(!PrivateChatMessageStore.isSessionInitialized(SESSION_ID));
    expect(PrivateChatMessageStore.getSessionMessages(SESSION_ID)).toEqual(undefined);
  });
});