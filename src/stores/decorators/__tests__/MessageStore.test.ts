import { checkUnreadSessionInfo } from 'utils/MessageUtils';
import PrivateChatActions from 'actions/reflux/PrivateChatActions';
import PrivateChatMessageStore from 'stores/reflux/PrivateChatMessageStore';

import * as API from 'types/api';
import * as UI from 'types/ui';
import { messageSessionMapper } from 'utils/UrgencyUtils';
import { PrivateMessageUrgencies } from 'constants/UrgencyConstants';

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
  },
];

const chatSessionUnread = {
  message_counts: {
    total: 5,
    unread: {
      user: 1,
      bot: 1,
      status: 1,
      mention: 1,
      verbose: 1,
    },
  },
};

const clearMessages = () => {
  const emptyCounts: UI.MessageCounts = {
    message_counts: {
      total: 0,
      unread: {
        bot: 0,
        user: 0,
        status: 0,
        mention: 0,
        verbose: 0,
      },
    },
  };

  PrivateChatMessageStore._onSessionUpdated(emptyCounts, SESSION_ID);
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
    const setRead = jest.fn();

    const data = checkUnreadSessionInfo(chatSessionUnread, setRead);

    expect(setRead).toHaveBeenCalled();
    expect(data).toEqual({
      message_counts: {
        total: 5,
        unread: {
          user: 0,
          bot: 0,
          status: 0,
          mention: 0,
          verbose: 0,
        },
      },
    });
  });

  test('should map message urgencies', () => {
    const urgencies = messageSessionMapper(chatSessionUnread, PrivateMessageUrgencies);

    expect(urgencies).toEqual({
      [UI.UrgencyEnum.HIGHEST]: 2, // Mention + user
      [UI.UrgencyEnum.LOW]: 1, // Bot
      [UI.UrgencyEnum.HIDDEN]: 2, // Status + verbose
    });
  });

  test('should handle messages received during fetching', () => {
    const ChatMessage2 = {
      id: 2,
    } as API.ChatMessage;

    PrivateChatMessageStore._onStatusMessage(StatusMessage1, SESSION_ID);
    PrivateChatMessageStore._onChatMessage(ChatMessage2, SESSION_ID);

    (PrivateChatActions.fetchMessages as UI.AsyncActionType<any>).completed(
      SESSION_BASE,
      messages,
    );
    jest.runAllTimers();

    // All three messages should have been stored
    expect(PrivateChatMessageStore.getSessionMessages(SESSION_ID)).toEqual([
      ...messages,
      {
        chat_message: ChatMessage2,
      },
    ]);
  });

  test('should remove duplicates arriving after fetching', () => {
    (PrivateChatActions.fetchMessages as UI.AsyncActionType<any>).completed(
      SESSION_BASE,
      messages,
    );
    jest.runAllTimers();

    PrivateChatMessageStore._onStatusMessage(StatusMessage1, SESSION_ID);

    expect(PrivateChatMessageStore.getSessionMessages(SESSION_ID)).toEqual(messages);
  });

  test('should remove session data', () => {
    (PrivateChatActions.fetchMessages as UI.AsyncActionType<any>).completed(
      SESSION_BASE,
      messages,
    );
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
