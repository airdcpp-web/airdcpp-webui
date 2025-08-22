import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { waitFor } from '@testing-library/react';

import { renderDataRoutes } from '@/tests/render/test-renderers';

import Messages from '../components/Messages';
import {
  PrivateChat1,
  PrivateChat1MessageMagnet,
  PrivateChat1MessageMe,
  PrivateChat1MessageMention,
  PrivateChat1MessageOther,
  PrivateChat1MessageRelease,
  PrivateChat1MessagesResponse,
  PrivateChat2,
  PrivateChat2MessageOther,
  PrivateChat2MessagesResponse,
  PrivateChat3,
} from '@/tests/mocks/api/private-chat';
import PrivateChatConstants from '@/constants/PrivateChatConstants';
import { CommonDataMocks, initCommonDataMocks } from '@/tests/mocks/mock-data-common';
import { setupUserEvent } from '@/tests/helpers/test-form-helpers';

import * as API from '@/types/api';

import SocketNotificationListener from '@/components/main/notifications/SocketNotificationListener';
import {
  NOTIFICATION_EVENT_TYPE,
  NotificationEventEmitter,
} from '@/components/main/notifications/effects/NotificationManager';
import { LocalSettings } from '@/constants/LocalSettingConstants';
import { VIEW_FIXED_HEIGHT } from '@/tests/render/test-containers';
import {
  waitExpectRequestToMatchSnapshot,
  navigateToUrl,
  waitForData,
  waitForUrl,
} from '@/tests/helpers/test-helpers';
import { getMockServer, MockServer } from '@/tests/mocks/mock-server';
import { getHistoryUrl } from '@/routes/Sidebar/components/RecentLayout';
import { HistoryEntryEnum } from '@/constants/HistoryConstants';
import { HistoryPrivateChatResponse } from '@/tests/mocks/api/history';
import UserConstants from '@/constants/UserConstants';
import {
  SearchHintedUser1Response,
  SearchNicksHubUser1Response,
} from '@/tests/mocks/api/user';
import {
  expectScrolledToBottom,
  expectScrollTop,
  incrementChatSessionUserMessageCounts,
  scrollMessageView,
} from '@/tests/helpers/test-message-helpers';
import { generateChatMessages } from '@/tests/mocks/helpers/mock-message-helpers';

import '@/style.css';
import { installActionMenuMocks } from '@/components/action-menu/__tests__/test-action-menu-helpers';
import MenuConstants from '@/constants/MenuConstants';
import { RemoteMenuGrouped1 } from '@/tests/mocks/api/menu';
import { clickMenuItem, clickSubMenu, openMenu } from '@/tests/helpers/test-menu-helpers';
import { formatMagnetCaption, parseMagnetLink } from '@/utils/MagnetUtils';
import QueueConstants from '@/constants/QueueConstants';
import { QueueBundleCreateFileResponse } from '@/tests/mocks/api/queue-bundles';
import { createDataFetchRoutes } from '@/tests/helpers/test-route-helpers';
import {
  installSessionMessageMocks,
  waitSessionsLoaded,
} from '@/tests/mocks/mock-session';

// tslint:disable:no-empty
describe('Private messages', () => {
  let server: MockServer;

  beforeEach(() => {
    server = getMockServer();
  });

  afterEach(() => {
    server.stop();
  });

  const getSocket = async () => {
    const commonData = await initCommonDataMocks(server, {
      permissions: [
        API.AccessEnum.PRIVATE_CHAT_VIEW,
        API.AccessEnum.PRIVATE_CHAT_EDIT,
        API.AccessEnum.PRIVATE_CHAT_SEND,

        // For the highlights
        API.AccessEnum.SEARCH,
        API.AccessEnum.DOWNLOAD,
      ],
    });

    // Messages
    const session1Mocks = installSessionMessageMocks(
      PrivateChatConstants.SESSIONS_URL,
      PrivateChat1.id,
      PrivateChat1MessagesResponse,
      server,
    );

    const session2Mocks = installSessionMessageMocks(
      PrivateChatConstants.SESSIONS_URL,
      PrivateChat2.id,
      PrivateChat2MessagesResponse,
      server,
    );

    // New layout
    server.addRequestHandler(
      'GET',
      getHistoryUrl(HistoryEntryEnum.PRIVATE_CHAT),
      HistoryPrivateChatResponse,
    );

    server.addRequestHandler(
      'POST',
      UserConstants.SEARCH_HINTED_USER_URL,
      SearchHintedUser1Response,
    );

    server.addRequestHandler(
      'POST',
      UserConstants.SEARCH_NICKS_URL,
      SearchNicksHubUser1Response,
    );

    const onSessionCreated = vi.fn(() => {
      commonData.mockStoreListeners.privateChat.created.fire(PrivateChat1);
    });
    server.addRequestHandler(
      'POST',
      PrivateChatConstants.SESSIONS_URL,
      PrivateChat1,
      onSessionCreated,
    );

    // Menus
    const menuMocks = installActionMenuMocks(
      MenuConstants.PRIVATE_CHAT_MESSAGE_HIGHLIGHT,
      [RemoteMenuGrouped1],
      server,
    );

    return {
      commonData,

      session1Mocks,
      session2Mocks,

      onSessionCreated,

      menuMocks,
    };
  };

  const renderLayout = async (userActive = true) => {
    const { commonData, ...other } = await getSocket();

    if (userActive) {
      commonData.sessionStore.getState().activity.setUserActive(true);
    }

    const MessageLayoutTest = () => {
      return (
        <>
          <Messages />
          <SocketNotificationListener />
        </>
      );
    };

    const routes = createDataFetchRoutes([
      {
        path: '/messages/:session?/:id?/*',
        Component: MessageLayoutTest,
      },
    ]);

    const renderData = renderDataRoutes(routes, commonData, {
      routerProps: { initialEntries: ['/messages'] },
      viewType: VIEW_FIXED_HEIGHT,
    });

    const userEvent = setupUserEvent();
    return { ...commonData, ...renderData, ...other, userEvent };
  };

  test('should load messages', async () => {
    const { getByText, queryByText } = await renderLayout();

    await waitSessionsLoaded(queryByText);

    // Check content
    await waitFor(() => expect(getByText(PrivateChat1MessageMe.text)).toBeTruthy());
  });

  test('should handle read messages', async () => {
    const {
      getByText,
      queryByText,
      mockStoreListeners,
      session1Mocks,
      session2Mocks,
      sessionStore,
      appStore,
      userEvent,
    } = await renderLayout();

    appStore.getState().settings.setValue(LocalSettings.NOTIFY_PM_BOT, true); // The second session is for a bot

    const onNotification = vi.fn();
    NotificationEventEmitter.addEventListener(NOTIFICATION_EVENT_TYPE, onNotification);

    await waitSessionsLoaded(queryByText);

    await waitFor(() =>
      expect(sessionStore.getState().privateChats.activeSessionId).toEqual(
        PrivateChat1.id,
      ),
    );
    await waitFor(() => expect(session1Mocks.onMessagesRead).toHaveBeenCalledTimes(1));

    // Send message for the active session
    mockStoreListeners.privateChat.updated.fire(
      incrementChatSessionUserMessageCounts(
        PrivateChat1.message_counts,
        PrivateChat1.id,
        sessionStore.getState().privateChats,
      ),
      PrivateChat1.id,
    );
    mockStoreListeners.privateChat.chatMessage.fire(
      {
        ...PrivateChat1MessageOther,
        text: 'Chat 1 new message',
        id: PrivateChat1MessageOther.id + 1,
        is_read: false,
      },
      PrivateChat1.id,
    );
    await waitFor(() => expect(session1Mocks.onMessagesRead).toHaveBeenCalledTimes(2));
    expect(onNotification).toHaveBeenCalledTimes(0);

    // Send message for the background session
    mockStoreListeners.privateChat.updated.fire(
      incrementChatSessionUserMessageCounts(
        PrivateChat2.message_counts,
        PrivateChat2.id,
        sessionStore.getState().privateChats,
      ),
      PrivateChat2.id,
    );
    mockStoreListeners.privateChat.chatMessage.fire(
      {
        ...PrivateChat2MessageOther,
        text: 'Chat 2 new message',
        id: PrivateChat2MessageOther.id + 1,
        is_read: false,
      },
      PrivateChat2.id,
    );
    await waitFor(() => expect(session2Mocks.onMessagesRead).toHaveBeenCalledTimes(0));
    expect(onNotification).toHaveBeenCalledTimes(1);

    // Activate the background session
    const session2MenuItem = queryByText(PrivateChat2.user.nicks);
    await userEvent.click(session2MenuItem!);

    await waitFor(() => expect(session2Mocks.onMessagesRead).toHaveBeenCalledTimes(1));
    expect(sessionStore.getState().privateChats.activeSessionId).toEqual(PrivateChat2.id);

    await waitFor(() => expect(getByText(PrivateChat2MessageOther.text)).toBeTruthy());
  });

  test('should remember input text when switching between sessions', async () => {
    const { getByText, getByRole, queryByText, userEvent } = await renderLayout();

    await waitSessionsLoaded(queryByText);

    // Check content
    await waitFor(() => expect(getByText(PrivateChat1MessageMe.text)).toBeTruthy());
    await waitFor(() => expect(getByRole('textbox')).toBeInTheDocument());

    const session1Message = 'Message session 1';

    const messageInput = getByRole('textbox');
    await userEvent.type(messageInput, session1Message);
    await waitFor(() => expect(messageInput).toHaveValue(session1Message));

    // Switch to the second session
    const session2MenuItem = queryByText(PrivateChat2.user.nicks);
    await userEvent.click(session2MenuItem!);

    await waitFor(() => expect(getByText(PrivateChat2MessageOther.text)).toBeTruthy());

    // Check that the value was cleared
    await waitFor(() => expect(messageInput).toHaveValue(''));

    // Go back to first session
    const session1MenuItem = queryByText(PrivateChat1.user.nicks);
    await userEvent.click(session1MenuItem!);

    await waitFor(() => expect(getByText(PrivateChat1MessageMe.text)).toBeTruthy());
    await waitFor(() => expect(messageInput).toHaveValue(session1Message));
  });

  test('should handle user inactivity', async () => {
    const { queryByText, mockStoreListeners, session1Mocks, sessionStore } =
      await renderLayout(false);

    const onNotification = vi.fn();
    NotificationEventEmitter.addEventListener(NOTIFICATION_EVENT_TYPE, onNotification);

    await waitSessionsLoaded(queryByText);

    await waitFor(() =>
      expect(sessionStore.getState().privateChats.activeSessionId).toEqual(
        PrivateChat1.id,
      ),
    );

    // Send message while the user is inactive
    mockStoreListeners.privateChat.updated.fire(
      incrementChatSessionUserMessageCounts(
        PrivateChat1.message_counts,
        PrivateChat1.id,
        sessionStore.getState().privateChats,
      ),
      PrivateChat1.id,
    );
    mockStoreListeners.privateChat.chatMessage.fire(
      {
        ...PrivateChat1MessageOther,
        text: 'Chat 1 new message',
        id: PrivateChat1MessageOther.id + 1,
        is_read: false,
      },
      PrivateChat1.id,
    );

    await waitFor(() => expect(onNotification).toHaveBeenCalledTimes(1));
    await waitFor(() => expect(session1Mocks.onMessagesRead).toHaveBeenCalledTimes(0));

    // Activate the user
    sessionStore.getState().activity.setUserActive(true);
    await waitFor(() => expect(session1Mocks.onMessagesRead).toHaveBeenCalledTimes(1));
  });

  test('open new session', async () => {
    const {
      queryByText,
      sessionStore,
      router,
      getByRole,
      findByText,
      getByText,
      userEvent,
    } = await renderLayout();

    await waitSessionsLoaded(queryByText);

    // Remove existing sessions
    sessionStore.getState().privateChats.removeSession(PrivateChat1);
    sessionStore.getState().privateChats.removeSession(PrivateChat2);
    sessionStore.getState().privateChats.removeSession(PrivateChat3);

    // We should be redirected to the new session layout
    await waitForUrl('/messages/new', router);
    await waitForData('Loading data...', queryByText);

    // Type the user nick
    const input = getByRole('combobox');
    await userEvent.type(input, PrivateChat1.user.nicks);

    await waitFor(() => expect(findByText(PrivateChat1.user.nicks)).toBeTruthy());

    // Click the user
    const user1Item = getByText(PrivateChat1.user.nicks);
    await userEvent.click(user1Item!);

    // We should be redirected to the new session
    await waitFor(() =>
      expect(sessionStore.getState().privateChats.activeSessionId).toEqual(
        PrivateChat1.id,
      ),
    );

    await waitFor(() => expect(getByText(PrivateChat1MessageMe.text)).toBeTruthy());
  });

  const generateSessionMessages = (
    sessionId: string,
    mockStoreListeners: CommonDataMocks['mockStoreListeners'],
    startId?: number,
  ) => {
    const newMessages = generateChatMessages(20, startId);
    newMessages.forEach((message) => {
      mockStoreListeners.privateChat.chatMessage.fire(message, sessionId);
    });

    return newMessages;
  };

  describe('scroll', () => {
    test('should handle scroll between the sessions', async () => {
      const renderResult = await renderLayout();
      const {
        getByText,
        getByRole,
        mockStoreListeners,
        sessionStore,
        queryByText,
        userEvent,
        instanceId,
      } = renderResult;

      await waitSessionsLoaded(queryByText);

      // Generate messages
      const newMessages1 = generateSessionMessages(
        PrivateChat1.id,
        mockStoreListeners,
        1000,
      );
      const newMessages2 = generateSessionMessages(
        PrivateChat2.id,
        mockStoreListeners,
        2000,
      );

      await waitFor(() => expect(getByText(newMessages1[19].text)).toBeTruthy());

      expect(
        sessionStore
          .getState()
          .privateChats.messages.isSessionInitialized(PrivateChat1.id),
      ).toBeTruthy();

      // Check that we are scrolled to the bottom
      const scrollContainer = getByRole('article');
      await waitFor(() => expectScrolledToBottom(scrollContainer));

      // Scroll to a message
      const scrollMessage1 = newMessages1[5];

      await scrollMessageView(scrollMessage1.id, instanceId, scrollContainer, () =>
        sessionStore
          .getState()
          .privateChats.messages.scroll.getScrollData(PrivateChat1.id),
      );

      const newScrollPosition = Math.round(scrollContainer.scrollTop);

      // Go to another session
      const session2MenuItem = queryByText(PrivateChat2.user.nicks);
      await userEvent.click(session2MenuItem!);

      await waitFor(() => expect(getByText(PrivateChat2MessageOther.text)).toBeTruthy());
      expectScrolledToBottom(scrollContainer);

      // Scroll the other session
      const scrollMessage2 = newMessages2[5];
      await scrollMessageView(scrollMessage2.id, instanceId, scrollContainer, () =>
        sessionStore
          .getState()
          .privateChats.messages.scroll.getScrollData(PrivateChat2.id),
      );

      // Go back
      const session1MenuItem = queryByText(PrivateChat1.user.nicks);
      await userEvent.click(session1MenuItem!);

      await waitFor(() => expect(getByText(newMessages1[0].text)).toBeTruthy());

      // Check that the scroll position was restored
      await expectScrollTop(scrollContainer, newScrollPosition);
    });

    test('should restore scroll when opening the layout', async () => {
      const renderResult = await renderLayout();
      const {
        getByText,
        getByRole,
        mockStoreListeners,
        sessionStore,
        queryByText,
        router,
        instanceId,
      } = renderResult;

      await waitSessionsLoaded(queryByText);

      // Generate messages
      const newMessages1 = generateSessionMessages(
        PrivateChat1.id,
        mockStoreListeners,
        1000,
      );

      await waitFor(() => expect(getByText(newMessages1[19].text)).toBeTruthy());

      expect(
        sessionStore
          .getState()
          .privateChats.messages.isSessionInitialized(PrivateChat1.id),
      ).toBeTruthy();

      // Scroll to a message
      const scrollMessage1 = newMessages1[5];

      let scrollContainer = getByRole('article');
      await scrollMessageView(scrollMessage1.id, instanceId, scrollContainer, () =>
        sessionStore
          .getState()
          .privateChats.messages.scroll.getScrollData(PrivateChat1.id),
      );

      const newScrollPosition = Math.round(scrollContainer.scrollTop);

      // Close the view
      await navigateToUrl('/', router);

      // Go back
      await navigateToUrl(`/messages/session/${PrivateChat1.id}`, router);

      await waitFor(() => expect(getByText(newMessages1[0].text)).toBeTruthy());

      // Check that the scroll position was restored
      scrollContainer = getByRole('article');
      await expectScrollTop(scrollContainer, newScrollPosition);
    });

    test('should scroll to bottom when opening the layout', async () => {
      const renderResult = await renderLayout();
      const {
        getByText,
        getByRole,
        mockStoreListeners,
        sessionStore,
        queryByText,
        router,
      } = renderResult;

      await waitSessionsLoaded(queryByText);

      // Generate messages
      const newMessages1 = generateSessionMessages(
        PrivateChat1.id,
        mockStoreListeners,
        1000,
      );

      await waitFor(() => expect(getByText(newMessages1[19].text)).toBeTruthy());

      expect(
        sessionStore
          .getState()
          .privateChats.messages.isSessionInitialized(PrivateChat1.id),
      ).toBeTruthy();

      // Close the view
      await navigateToUrl('/', router);

      // Go back
      await navigateToUrl(`/messages/session/${PrivateChat1.id}`, router);

      await waitFor(() => expect(getByText(newMessages1[0].text)).toBeTruthy());

      // Check scroll position
      const scrollContainer = getByRole('article');
      await waitFor(() => expectScrolledToBottom(scrollContainer));
    });

    test('should scroll to bottom if the saved message is not found', async () => {
      const renderResult = await renderLayout();
      const {
        getByText,
        getByRole,
        mockStoreListeners,
        sessionStore,
        queryByText,
        router,
        instanceId,
      } = renderResult;

      await waitSessionsLoaded(queryByText);

      // Generate messages
      const newMessages1 = generateSessionMessages(
        PrivateChat1.id,
        mockStoreListeners,
        1000,
      );

      await waitFor(() => expect(getByText(newMessages1[19].text)).toBeTruthy());

      expect(
        sessionStore
          .getState()
          .privateChats.messages.isSessionInitialized(PrivateChat1.id),
      ).toBeTruthy();

      // Scroll to top
      const scrollMessage1 = PrivateChat1MessagesResponse[0].log_message!;

      let scrollContainer = getByRole('article');
      await scrollMessageView(scrollMessage1.id, instanceId, scrollContainer, () =>
        sessionStore
          .getState()
          .privateChats.messages.scroll.getScrollData(PrivateChat1.id),
      );

      // Close the view
      await navigateToUrl('/', router);

      // Remove the first message
      sessionStore.getState().privateChats.messages.updateSession(
        {
          message_counts: {
            total:
              sessionStore.getState().privateChats.messages.messages.get(PrivateChat1.id)!
                .length - 1,
            unread: PrivateChat1.message_counts.unread,
          },
        },
        PrivateChat1.id,
      );

      // Go back
      await navigateToUrl(`/messages/session/${PrivateChat1.id}`, router);

      await waitFor(() => expect(getByText(newMessages1[0].text)).toBeTruthy());

      // Check scroll position
      scrollContainer = getByRole('article');
      await waitFor(() => expectScrolledToBottom(scrollContainer));
    });
  });

  describe('highlights', () => {
    test('should render mentions', async () => {
      const { queryByText, getByText } = await renderLayout();

      await waitSessionsLoaded(queryByText);
      await waitFor(() =>
        expect(getByText(PrivateChat1MessageMention.highlights[0].text)).toBeTruthy(),
      );

      const highlight = getByText(PrivateChat1MessageMention.highlights[0].text);
      expect(highlight.className).toBe('highlight bold');
    });

    test('should render releases', async () => {
      const renderData = await renderLayout();
      const { queryByText, getByText, menuMocks } = renderData;

      await waitSessionsLoaded(queryByText);
      await waitFor(() =>
        expect(getByText(PrivateChat1MessageRelease.highlights[0].text)).toBeTruthy(),
      );

      await openMenu(PrivateChat1MessageRelease.highlights[0].text, renderData);
      const { clickSubMenuItem } = await clickSubMenu(
        RemoteMenuGrouped1.title,
        renderData,
      );
      await clickSubMenuItem(RemoteMenuGrouped1.items[0].title);

      await waitExpectRequestToMatchSnapshot(menuMocks.onListGrouped);
    });

    test('should render magnet', async () => {
      const renderData = await renderLayout();
      const { queryByText, getByText, formatter } = renderData;

      const onDownloadFile = vi.fn();
      server.addRequestHandler(
        'POST',
        `${QueueConstants.BUNDLES_URL}/file`,
        QueueBundleCreateFileResponse,
        onDownloadFile,
      );

      await waitSessionsLoaded(queryByText);

      const magnet = parseMagnetLink(PrivateChat1MessageMagnet.highlights[0].text)!;
      const caption = formatMagnetCaption(magnet, formatter);
      await waitFor(() => expect(getByText(caption)).toBeTruthy());

      await openMenu(caption, renderData);
      await clickMenuItem('Download', renderData);

      await waitExpectRequestToMatchSnapshot(onDownloadFile);
    });
  });
});
