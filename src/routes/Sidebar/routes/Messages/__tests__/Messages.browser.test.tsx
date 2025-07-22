import { afterEach, beforeAll, beforeEach, describe, expect, test, vi } from 'vitest';
import { RenderResult, waitFor, waitForElementToBeRemoved } from '@testing-library/react';

import { getMockServer } from 'airdcpp-apisocket/tests';

import { renderDataRoutes } from '@/tests/render/test-renderers';

import Messages from '../components/Messages';
import {
  PrivateChat1,
  PrivateChat1MessageMe,
  PrivateChat1MessageOther,
  PrivateChat1MessagesResponse,
  PrivateChat2,
  PrivateChat2MessageOther,
  PrivateChat2MessagesResponse,
} from '@/tests/mocks/api/private-chat';
import { useStoreDataFetch } from '@/components/main/effects/StoreDataFetchEffect';
import PrivateChatConstants from '@/constants/PrivateChatConstants';
import { initCommonDataMocks } from '@/tests/mocks/mock-data-common';
import { setupUserEvent } from '@/tests/helpers/test-form-helpers';

import * as API from '@/types/api';

import SocketNotificationListener from '@/components/main/notifications/SocketNotificationListener';
import {
  NOTIFICATION_EVENT_TYPE,
  NotificationEventEmitter,
} from '@/components/main/notifications/effects/NotificationManager';
import { LocalSettings } from '@/constants/LocalSettingConstants';
import { VIEW_FIXED_HEIGHT } from '@/tests/render/test-containers';

// tslint:disable:no-empty
describe('Private messages', () => {
  let server: ReturnType<typeof getMockServer>;

  /*const addTempShareHandlers = () => {
    server.addRequestHandler(
      'GET',
      ShareConstants.TEMP_SHARES_URL,
      ShareTempItemListResponse,
    );

    const tempItemAdded = server.addSubscriptionHandler(
      ShareConstants.MODULE_URL,
      ShareConstants.TEMP_ITEM_ADDED,
    );

    const tempItemRemoved = server.addSubscriptionHandler(
      ShareConstants.MODULE_URL,
      ShareConstants.TEMP_ITEM_REMOVED,
    );
  }*/

  const getSocket = async () => {
    const commonData = await initCommonDataMocks(server, [
      API.AccessEnum.PRIVATE_CHAT_VIEW,
      API.AccessEnum.PRIVATE_CHAT_EDIT,
      API.AccessEnum.PRIVATE_CHAT_SEND,
    ]);

    // Messages
    const onSession1Read = vi.fn();
    server.addRequestHandler(
      'POST',
      `${PrivateChatConstants.SESSIONS_URL}/${PrivateChat1.id}/messages/read`,
      undefined,
      onSession1Read,
    );

    const onSession2Read = vi.fn();
    server.addRequestHandler(
      'POST',
      `${PrivateChatConstants.SESSIONS_URL}/${PrivateChat2.id}/messages/read`,
      undefined,
      onSession2Read,
    );

    server.addRequestHandler(
      'GET',
      `${PrivateChatConstants.SESSIONS_URL}/${PrivateChat1.id}/messages/0`,
      PrivateChat1MessagesResponse,
    );

    server.addRequestHandler(
      'GET',
      `${PrivateChatConstants.SESSIONS_URL}/${PrivateChat2.id}/messages/0`,
      PrivateChat2MessagesResponse,
    );

    return {
      commonData,
      onSession1Read,
      onSession2Read,
    };
  };

  const renderLayout = async () => {
    const { commonData, ...other } = await getSocket();

    const MessageLayoutTest = () => {
      useStoreDataFetch(true);
      return (
        <>
          <Messages />
          <SocketNotificationListener />
        </>
      );
    };

    const routes = [
      {
        path: '/messages/:session?/:id?/*',
        Component: MessageLayoutTest,
      },
    ];

    const renderData = renderDataRoutes(routes, commonData, {
      routerProps: { initialEntries: ['/messages'] },
      viewType: VIEW_FIXED_HEIGHT,
    });

    return { ...commonData, ...renderData, ...other };
  };

  beforeAll(() => {
    localStorage.setItem('debug', 'true');
  });

  beforeEach(() => {
    server = getMockServer();
  });

  afterEach(() => {
    server.stop();
    localStorage.clear();
  });

  const waitLoaded = async (queryByText: RenderResult['queryByText']) => {
    await waitFor(() => queryByText(/Loading sessions/i));
    await waitForElementToBeRemoved(() => queryByText(/Loading sessions/i));

    await waitFor(() => queryByText(/Loading messages/i));
    await waitForElementToBeRemoved(() => queryByText(/Loading messages/i));
  };

  test('should load messages', async () => {
    const { getByText, queryByText, socket } = await renderLayout();

    await waitLoaded(queryByText);

    // Check content
    await waitFor(() => expect(getByText(PrivateChat1MessageMe.text)).toBeTruthy());

    socket.disconnect();
  });

  test('should handle read messages', async () => {
    const {
      getByText,
      queryByText,
      socket,
      mockStoreListeners,
      onSession1Read,
      onSession2Read,
      sessionStore,
      appStore,
    } = await renderLayout();

    appStore.getState().settings.setValue(LocalSettings.NOTIFY_PM_BOT, true); // The second session is for a bot

    const onNotification = vi.fn();
    NotificationEventEmitter.addEventListener(NOTIFICATION_EVENT_TYPE, onNotification);

    await waitLoaded(queryByText);

    expect(sessionStore.getState().privateChats.activeSessionId).toEqual(PrivateChat1.id);

    // Send message for the active session
    mockStoreListeners.privateChat.chatMessage.fire(
      {
        ...PrivateChat1MessageOther,
        text: 'Chat 1 new message',
        id: PrivateChat1MessageOther.id + 1,
        is_read: false,
      },
      PrivateChat1.id,
    );
    await waitFor(() => expect(onSession1Read).toHaveBeenCalledTimes(1));
    expect(onNotification).toHaveBeenCalledTimes(0);

    // Send message for the background session
    mockStoreListeners.privateChat.chatMessage.fire(
      {
        ...PrivateChat2MessageOther,
        text: 'Chat 2 new message',
        id: PrivateChat2MessageOther.id + 1,
        is_read: false,
      },
      PrivateChat2.id,
    );
    await waitFor(() => expect(onSession2Read).toHaveBeenCalledTimes(0));
    expect(onNotification).toHaveBeenCalledTimes(1);

    // Activate the background session
    const userEvent = setupUserEvent();
    const session2MenuItem = queryByText(PrivateChat2.user.nicks);
    await userEvent.click(session2MenuItem!);

    await waitFor(() => expect(onSession2Read).toHaveBeenCalledTimes(1));
    expect(sessionStore.getState().privateChats.activeSessionId).toEqual(PrivateChat2.id);

    await waitFor(() => expect(getByText(PrivateChat2MessageOther.text)).toBeTruthy());

    socket.disconnect();
  });
});
