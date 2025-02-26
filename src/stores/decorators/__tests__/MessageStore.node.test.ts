import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';

import { checkUnreadSessionInfo, listMessageSort } from '@/utils/MessageUtils';

import * as API from '@/types/api';
import * as UI from '@/types/ui';

import { messageSessionMapper } from '@/utils/UrgencyUtils';
import { PrivateMessageUrgencies } from '@/constants/UrgencyConstants';
import { getMockSession } from '@/tests/mocks/mock-session';

import { getConnectedSocket, getMockServer } from 'airdcpp-apisocket/tests';

import { addMockStoreSocketListeners } from '@/tests/mocks/mock-store';
import {
  PrivateChat1,
  PrivateChat1MessageMe,
  PrivateChat1MessageOther,
  PrivateChat1MessagesResponse,
  PrivateChat1MessageStatus,
} from '@/tests/mocks/api/private-chat';
import { createAppStore } from '@/stores';

const SESSION_ID = PrivateChat1.id;
const SESSION_BASE = {
  id: SESSION_ID,
};

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

describe('message store', () => {
  let server: ReturnType<typeof getMockServer>;
  beforeEach(() => {
    server = getMockServer();
  });

  afterEach(() => {
    server.stop();
  });

  const createMockAppStore = (initProps: UI.StoreInitData) => {
    const appStore = createAppStore();
    const mocks = addMockStoreSocketListeners(appStore, initProps, server);

    return { appStore, mocks };
  };

  const initStore = async () => {
    const { socket } = await getConnectedSocket(server);
    const initProps = {
      login: getMockSession(),
      socket,
    };

    const { appStore, mocks } = createMockAppStore(initProps);
    mocks.privateChat.created.fire(PrivateChat1);
    return { appStore, mocks };
  };

  const addMessages = (
    privateChat: ReturnType<typeof addMockStoreSocketListeners>['privateChat'],
  ) => {
    privateChat.statusMessage.fire(PrivateChat1MessageStatus, SESSION_ID);
    privateChat.chatMessage.fire(PrivateChat1MessageMe, SESSION_ID);
    privateChat.chatMessage.fire(PrivateChat1MessageOther, SESSION_ID);
  };

  test('should add individual messages', async () => {
    const {
      appStore,
      mocks: { privateChat },
    } = await initStore();

    addMessages(privateChat);

    expect(appStore.getState().privateChats.messages.messages.get(SESSION_ID)).toEqual(
      PrivateChat1MessagesResponse,
    );
  });

  test('should clear messages', async () => {
    const {
      appStore,
      mocks: { privateChat },
    } = await initStore();

    // Add message
    privateChat.statusMessage.fire(PrivateChat1MessageStatus, SESSION_ID);

    // Clear messages
    privateChat.updated.fire(emptyCounts, SESSION_ID);

    expect(
      appStore.getState().privateChats.messages.messages.get(SESSION_ID)!.length,
    ).toEqual(0);
  });

  test('should reset unread counts for active sessions', () => {
    const setRead = vi.fn();

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

  test('should handle messages received during fetching', async () => {
    const {
      appStore,
      mocks: { privateChat },
    } = await initStore();

    // Duplicate message
    privateChat.statusMessage.fire(PrivateChat1MessageStatus, SESSION_ID);

    // New message that doesn't exist in the list response
    const ChatMessageReceived = {
      ...PrivateChat1MessageOther,
      id: 7,
      time: PrivateChat1MessageStatus.time + 1,
    } as API.ChatMessage;

    privateChat.chatMessage.fire(ChatMessageReceived, SESSION_ID);

    appStore
      .getState()
      .privateChats.messages.onMessagesFetched(
        SESSION_BASE,
        PrivateChat1MessagesResponse,
      );

    // All messages should have been stored
    expect(appStore.getState().privateChats.messages.messages.get(SESSION_ID)).toEqual(
      [
        ...PrivateChat1MessagesResponse,
        {
          chat_message: ChatMessageReceived,
        },
      ].sort(listMessageSort),
    );
  });

  test('should remove duplicates arriving after fetching', async () => {
    const {
      appStore,
      mocks: { privateChat },
    } = await initStore();

    appStore
      .getState()
      .privateChats.messages.onMessagesFetched(
        SESSION_BASE,
        PrivateChat1MessagesResponse,
      );

    privateChat.chatMessage.fire(PrivateChat1MessageOther, SESSION_ID);

    expect(appStore.getState().privateChats.messages.messages.get(SESSION_ID)).toEqual(
      PrivateChat1MessagesResponse,
    );
  });

  test('should remove session data', async () => {
    const {
      appStore,
      mocks: { privateChat },
    } = await initStore();

    appStore
      .getState()
      .privateChats.messages.onMessagesFetched(
        SESSION_BASE,
        PrivateChat1MessagesResponse,
      );

    expect(appStore.getState().privateChats.messages.isSessionInitialized(SESSION_ID));
    expect(appStore.getState().privateChats.messages.messages.get(SESSION_ID)).toEqual(
      PrivateChat1MessagesResponse,
    );

    privateChat.removed.fire({
      id: SESSION_ID,
    });

    expect(!appStore.getState().privateChats.messages.isSessionInitialized(SESSION_ID));
    expect(appStore.getState().privateChats.messages.messages.get(SESSION_ID)).toEqual(
      undefined,
    );
  });
});
