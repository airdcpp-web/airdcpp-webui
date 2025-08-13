import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { RenderResult, waitFor } from '@testing-library/react';

import { renderDataRoutes } from '@/tests/render/test-renderers';

import { useStoreDataFetch } from '@/components/main/effects/StoreDataFetchEffect';
import { initCommonDataMocks } from '@/tests/mocks/mock-data-common';

import * as API from '@/types/api';
import * as UI from '@/types/ui';

import SocketNotificationListener from '@/components/main/notifications/SocketNotificationListener';
import {
  NOTIFICATION_EVENT_TYPE,
  NotificationEventEmitter,
} from '@/components/main/notifications/effects/NotificationManager';
import { VIEW_FIXED_HEIGHT } from '@/tests/render/test-containers';
import { clickButton, waitForData, waitForUrl } from '@/tests/helpers/test-helpers';
import { getMockServer, MockServer } from '@/tests/mocks/mock-server';

import EventConstants from '@/constants/EventConstants';
import {
  EventCountsResponse,
  EventMessageError,
  EventMessageInfo,
  EventMessagesResponse,
} from '@/tests/mocks/api/events';
import Events from '../components/EventsLayout';
import { TestRouteNavigateButton } from '@/tests/helpers/test-route-helpers';
import { generateStatusMessages } from '@/tests/mocks/helpers/mock-message-helpers';
import { clickMenuItem, openMenu } from '@/tests/helpers/test-menu-helpers';
import { setupUserEvent } from '@/tests/helpers/test-form-helpers';

import { installActionMenuMocks } from '@/components/action-menu/__tests__/test-action-menu-helpers';
import MenuConstants from '@/constants/MenuConstants';
import {
  expectScrolledToBottom,
  expectScrollTop,
  scrollMessageView,
} from '@/tests/helpers/test-message-helpers';
import { StoreApi } from 'zustand';

const GoToEventsCaption = 'Go to events';

// tslint:disable:no-empty
describe('Events', () => {
  let server: MockServer;

  beforeEach(() => {
    server = getMockServer();
  });

  afterEach(() => {
    server.stop();
  });

  const getSocket = async () => {
    const commonData = await initCommonDataMocks(server, {
      permissions: [API.AccessEnum.EVENTS_EDIT, API.AccessEnum.EVENTS_VIEW],
    });

    // Context menu
    installActionMenuMocks(MenuConstants.EVENTS, [], server);

    // Messages
    const onRead = vi.fn();
    server.addRequestHandler('POST', EventConstants.READ_URL, undefined, onRead);

    const onGetMessages = vi.fn();
    server.addRequestHandler(
      'GET',
      `${EventConstants.MESSAGES_URL}/0`,
      EventMessagesResponse,
      onGetMessages,
    );

    return {
      commonData,
      onRead,
      onGetMessages,
    };
  };

  interface RenderLayoutProps {
    userActive?: boolean;
    initEvents: boolean;
  }

  const renderLayout = async ({
    userActive = true,
    initEvents = true,
  }: RenderLayoutProps) => {
    const { commonData, ...other } = await getSocket();

    const EventLayoutTest = () => {
      useStoreDataFetch(true);
      return (
        <>
          <Events />
          <SocketNotificationListener />
        </>
      );
    };

    const IndexPage = () => {
      return (
        <>
          <TestRouteNavigateButton route={'/events'} caption={GoToEventsCaption} />
          <SocketNotificationListener />
        </>
      );
    };

    const routes = [
      {
        index: true,
        Component: IndexPage,
      },
      {
        path: '/events/*',
        Component: EventLayoutTest,
      },
    ];

    const renderData = renderDataRoutes(routes, commonData, {
      routerProps: { initialEntries: ['/events'] },
      viewType: VIEW_FIXED_HEIGHT,
    });

    if (initEvents) {
      await waitFor(() =>
        expect(commonData.sessionStore.getState().initialDataFetched).toBeTruthy(),
      );

      commonData.sessionStore.getState().events.onMessagesFetched(EventMessagesResponse);
    }

    if (userActive) {
      commonData.sessionStore.getState().activity.setUserActive(true);
    }

    const userEvent = setupUserEvent();
    return { ...commonData, ...renderData, ...other, userEvent };
  };

  const waitLoaded = async (queryByText: RenderResult['queryByText']) => {
    await waitForData(/Loading messages/i, queryByText);
  };

  const incrementEventMessageCounts = (
    severity: API.SeverityEnum,
    sessionStore: StoreApi<UI.SessionStore>,
  ) => ({
    total: sessionStore.getState().events.logMessages!.length + 1,
    unread: {
      ...EventCountsResponse.unread,
      [severity]:
        EventCountsResponse.unread[severity as keyof typeof EventCountsResponse.unread] +
        1,
    },
  });

  test('should load messages', async () => {
    const { getByText, queryByText, onRead } = await renderLayout({
      initEvents: false,
    });

    await waitLoaded(queryByText);

    // Check content
    await waitFor(() => expect(getByText(EventMessageInfo.text)).toBeTruthy());
    await waitFor(() => expect(onRead).toHaveBeenCalledTimes(1));
  });

  test('should handle read messages', async () => {
    const { getByRole, mockStoreListeners, onRead, sessionStore, router } =
      await renderLayout({
        initEvents: true,
      });

    const onNotification = vi.fn();
    NotificationEventEmitter.addEventListener(NOTIFICATION_EVENT_TYPE, onNotification);

    await waitFor(() => expect(sessionStore.getState().events.viewActive).toBeTruthy());
    await waitFor(() => expect(onRead).toHaveBeenCalledTimes(1));

    // Send message for an active view
    mockStoreListeners.events.counts.fire(
      incrementEventMessageCounts(API.SeverityEnum.INFO, sessionStore),
    );
    mockStoreListeners.events.message.fire({
      ...EventMessageInfo,
      text: 'Event message info new',
      id: EventMessageInfo.id + 1,
      is_read: false,
    });

    await waitFor(() => expect(onRead).toHaveBeenCalledTimes(2));
    expect(onNotification).toHaveBeenCalledTimes(0);

    // Send message while the events view is not active
    router.navigate('/');

    await waitForUrl('/', router);
    await waitFor(() => expect(sessionStore.getState().events.viewActive).toBeFalsy());

    mockStoreListeners.events.counts.fire(
      incrementEventMessageCounts(API.SeverityEnum.ERROR, sessionStore),
    );
    mockStoreListeners.events.message.fire({
      ...EventMessageError,
      text: 'Event message error new',
      id: EventMessageError.id + 1,
      is_read: false,
    });
    await waitFor(() => expect(onRead).toHaveBeenCalledTimes(2));
    await waitFor(() => expect(onNotification).toHaveBeenCalledTimes(1));

    // Go back to events
    clickButton(GoToEventsCaption, getByRole);
    await waitForUrl('/events', router);

    await waitFor(() => expect(onRead).toHaveBeenCalledTimes(3));
    expect(sessionStore.getState().events.viewActive).toBeTruthy();
  });

  test('should handle user inactivity', async () => {
    const { getByText, onRead, mockStoreListeners, sessionStore } = await renderLayout({
      initEvents: true,
      userActive: false,
    });

    const onNotification = vi.fn();
    NotificationEventEmitter.addEventListener(NOTIFICATION_EVENT_TYPE, onNotification);

    // Check content
    await waitFor(() => expect(getByText(EventMessageInfo.text)).toBeTruthy());
    expect(onRead).toHaveBeenCalledTimes(0);

    // Send message while the user is inactive
    mockStoreListeners.events.counts.fire(
      incrementEventMessageCounts(API.SeverityEnum.ERROR, sessionStore),
    );
    mockStoreListeners.events.message.fire({
      ...EventMessageError,
      text: 'Event message error new',
      id: EventMessageError.id + 1,
      is_read: false,
    });

    await waitFor(() => expect(onNotification).toHaveBeenCalledTimes(1));
    await waitFor(() => expect(onRead).toHaveBeenCalledTimes(0));

    // Activate the user
    sessionStore.getState().activity.setUserActive(true);
    await waitFor(() => expect(onRead).toHaveBeenCalledTimes(1));
  });

  test('should handle scroll', async () => {
    const { getByText, getByRole, mockStoreListeners, sessionStore, router } =
      await renderLayout({
        initEvents: true,
      });

    expect(sessionStore.getState().events.isInitialized).toBeTruthy();

    // Check content
    await waitFor(() => expect(getByText(EventMessageInfo.text)).toBeTruthy());

    // Generate messages
    const newMessages = generateStatusMessages(20);
    newMessages.forEach((message) => {
      mockStoreListeners.events.message.fire(message);
    });

    await waitFor(() => expect(getByText(newMessages[19].text)).toBeTruthy());

    // Check that we are scrolled to the bottom
    const scrollContainer1 = getByRole('article');
    expectScrolledToBottom(scrollContainer1);

    // Scroll to a message
    const scrollMessage = newMessages[5];

    scrollMessageView(scrollMessage.id, scrollContainer1);

    await waitFor(() =>
      expect(sessionStore.getState().events.scroll.getScrollData()).toBe(
        scrollMessage.id,
      ),
    );

    const newScrollPosition = scrollContainer1.scrollTop;

    // Close the view
    router.navigate('/');
    await waitForUrl('/', router);

    expect(sessionStore.getState().events.scroll.getScrollData()).toBe(scrollMessage.id);

    // Go back
    router.navigate('/events');
    await waitForUrl('/events', router);
    await waitFor(() => expect(getByText(newMessages[0].text)).toBeTruthy());

    // Check that the scroll position was restored
    const scrollContainer2 = getByRole('article');
    await expectScrollTop(scrollContainer2, newScrollPosition);
  });

  test('should clear messages', async () => {
    const renderResult = await renderLayout({
      initEvents: true,
    });
    const { getByText, queryByText, mockStoreListeners } = renderResult;

    // Check content
    await waitFor(() => expect(getByText(EventMessageInfo.text)).toBeTruthy());

    const onClear = vi.fn(() => {
      mockStoreListeners.events.counts.fire({
        total: 0,
        unread: 0,
      });
    });
    server.addRequestHandler('DELETE', EventConstants.MESSAGES_URL, undefined, onClear);

    // Clear
    await openMenu('Events', renderResult);
    await clickMenuItem('Clear', renderResult);

    await waitFor(() => expect(onClear).toHaveBeenCalledTimes(1));
    expect(queryByText('No messages to show')).toBeTruthy();
  });
});
