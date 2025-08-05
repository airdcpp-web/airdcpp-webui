import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { RenderResult, waitFor } from '@testing-library/react';

import { renderDataRoutes } from '@/tests/render/test-renderers';

import { useStoreDataFetch } from '@/components/main/effects/StoreDataFetchEffect';
import { initCommonDataMocks } from '@/tests/mocks/mock-data-common';

import * as API from '@/types/api';

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
  EventMessageError,
  EventMessageInfo,
  EventMessagesResponse,
} from '@/tests/mocks/api/events';
import Events from '../components/EventsLayout';
import { TestRouteNavigateButton } from '@/tests/helpers/test-route-helpers';

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

    // Messages
    const onRead = vi.fn();
    server.addRequestHandler('POST', EventConstants.READ_URL, undefined, onRead);

    server.addRequestHandler(
      'GET',
      `${EventConstants.MESSAGES_URL}/0`,
      EventMessagesResponse,
    );

    return {
      commonData,
      onRead,
    };
  };

  const renderLayout = async () => {
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

    return { ...commonData, ...renderData, ...other };
  };

  const waitLoaded = async (queryByText: RenderResult['queryByText']) => {
    await waitForData(/Loading messages/i, queryByText);
  };

  test('should load messages', async () => {
    const { getByText, queryByText } = await renderLayout();

    await waitLoaded(queryByText);

    // Check content
    await waitFor(() => expect(getByText(EventMessageInfo.text)).toBeTruthy());
  });

  test('should handle read messages', async () => {
    const { getByRole, queryByText, mockStoreListeners, onRead, sessionStore, router } =
      await renderLayout();

    const onNotification = vi.fn();
    NotificationEventEmitter.addEventListener(NOTIFICATION_EVENT_TYPE, onNotification);

    await waitLoaded(queryByText);

    await waitFor(() => expect(sessionStore.getState().events.viewActive).toBeTruthy());

    // Send message for an active view
    mockStoreListeners.events.message.fire({
      ...EventMessageInfo,
      text: 'Event message info new',
      id: EventMessageInfo.id + 1,
      is_read: false,
    });
    await waitFor(() => expect(onRead).toHaveBeenCalledTimes(1));
    expect(onNotification).toHaveBeenCalledTimes(0);

    // Send message while the events view is not active
    router.navigate('/');

    await waitForUrl('/', router);
    await waitFor(() => expect(sessionStore.getState().events.viewActive).toBeFalsy());

    mockStoreListeners.events.message.fire({
      ...EventMessageError,
      text: 'Event message error new',
      id: EventMessageError.id + 1,
      is_read: false,
    });
    await waitFor(() => expect(onRead).toHaveBeenCalledTimes(1));
    await waitFor(() => expect(onNotification).toHaveBeenCalledTimes(1));

    // Go back to events
    clickButton(GoToEventsCaption, getByRole);
    await waitForUrl('/events', router);

    await waitFor(() => expect(onRead).toHaveBeenCalledTimes(2));
    expect(sessionStore.getState().events.viewActive).toBeTruthy();
  });
});
