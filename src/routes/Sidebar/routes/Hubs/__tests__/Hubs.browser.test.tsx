import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { waitFor, within } from '@testing-library/react';

import { renderDataRoutes } from '@/tests/render/test-renderers';

import { CommonDataMocks, initCommonDataMocks } from '@/tests/mocks/mock-data-common';
import { setupUserEvent, toggleCheckboxValue } from '@/tests/helpers/test-form-helpers';

import * as API from '@/types/api';

import SocketNotificationListener from '@/components/main/notifications/SocketNotificationListener';

import { VIEW_FIXED_HEIGHT } from '@/tests/render/test-containers';
/*import {
  waitExpectRequestToMatchSnapshot,
  navigateToUrl,
  waitForData,
  waitForUrl,
} from '@/tests/helpers/test-helpers';*/
import { getMockServer, MockServer } from '@/tests/mocks/mock-server';
import { getHistoryUrl } from '@/routes/Sidebar/components/RecentLayout';
import HistoryConstants, { HistoryEntryEnum } from '@/constants/HistoryConstants';

import { installActionMenuMocks } from '@/components/action-menu/__tests__/test-action-menu-helpers';
import MenuConstants from '@/constants/MenuConstants';
import { RemoteMenuGrouped1 } from '@/tests/mocks/api/menu';

import { createDataFetchRoutes } from '@/tests/helpers/test-route-helpers';
import {
  HubADC1,
  HubADC2,
  HubADC3,
  HubCountsResponse,
  HubNMDC1,
} from '@/tests/mocks/api/hubs';
import HubConstants from '@/constants/HubConstants';
import {
  installSessionMessageMocks,
  waitSessionsLoaded,
} from '@/tests/mocks/mock-session';
import { HistoryHubResponse, HistoryHubSearchResponse } from '@/tests/mocks/api/history';
import Hubs from '../components/Hubs';
import { installTableMocks } from '@/tests/mocks/mock-table';
import {
  Hub1MessageMe,
  HubADC1MessageListResponse,
  HubDisconnectedMessageListResponse,
} from '@/tests/mocks/api/hub-messages';
import { Hub1Bot, Hub1UserListResponse } from '@/tests/mocks/api/user';
import {
  navigateToUrl,
  waitExpectRequestToMatchSnapshot,
  waitForData,
  waitForUrl,
} from '@/tests/helpers/test-helpers';

// tslint:disable:no-empty
describe('Hubs', () => {
  let server: MockServer;

  beforeEach(() => {
    server = getMockServer();
  });

  afterEach(() => {
    server.stop();
  });

  const installHubSessionMocks = (sessionId: number) => {
    server.addRequestHandler(
      'GET',
      `${HubConstants.SESSIONS_URL}/${sessionId}/counts`,
      HubCountsResponse,
    );

    const countsListener = server.addSubscriptionHandler(
      HubConstants.MODULE_URL,
      HubConstants.SESSION_COUNTS_UPDATED,
      sessionId,
    );

    return { countsListener };
  };

  const installNewLayoutMocks = (commonData: CommonDataMocks) => {
    server.addRequestHandler(
      'GET',
      getHistoryUrl(HistoryEntryEnum.HUB),
      HistoryHubResponse,
    );

    server.addRequestHandler(
      'POST',
      `${HistoryConstants.SESSIONS_URL}/${HistoryEntryEnum.HUB}/search`,
      HistoryHubSearchResponse,
    );

    const onSessionCreated = vi.fn(() => {
      commonData.mockStoreListeners.hub.created.fire(HubADC1);
    });

    server.addRequestHandler(
      'POST',
      HubConstants.SESSIONS_URL,
      HubADC1,
      onSessionCreated,
    );

    return { onSessionCreated };
  };

  const getSocket = async () => {
    const commonData = await initCommonDataMocks(server, {
      permissions: [
        API.AccessEnum.HUBS_VIEW,
        API.AccessEnum.HUBS_EDIT,
        API.AccessEnum.HUBS_SEND,
      ],
    });

    // Messages
    const hub1MessageMocks = installSessionMessageMocks(
      HubConstants.SESSIONS_URL,
      HubADC1.id,
      HubADC1MessageListResponse,
      server,
    );

    const hub2MessageMocks = installSessionMessageMocks(
      HubConstants.SESSIONS_URL,
      HubADC2.id,
      HubDisconnectedMessageListResponse,
      server,
    );

    // New layout
    const { onSessionCreated } = installNewLayoutMocks(commonData);

    // Menus
    const menuMocks = installActionMenuMocks(
      MenuConstants.HUB_MESSAGE_HIGHLIGHT,
      [RemoteMenuGrouped1],
      server,
    );

    // Tables
    const hub1UserTableMocks = installTableMocks(Hub1UserListResponse, {
      server,
      moduleUrl: HubConstants.MODULE_URL,
      viewName: HubConstants.USER_VIEW_ID,
      entityId: HubADC1.id,
    });

    const hub2UserTableMocks = installTableMocks([], {
      server,
      moduleUrl: HubConstants.MODULE_URL,
      viewName: HubConstants.USER_VIEW_ID,
      entityId: HubADC2.id,
    });

    // Generic
    const sessionMocks1 = installHubSessionMocks(HubADC1.id);
    const sessionMocks2 = installHubSessionMocks(HubADC2.id);

    return {
      commonData,

      hub1Mocks: {
        ...hub1MessageMocks,
        ...sessionMocks1,
        userTable: hub1UserTableMocks,
      },

      hub2Mocks: {
        ...hub2MessageMocks,
        ...sessionMocks2,
        userTable: hub2UserTableMocks,
      },

      onSessionCreated,

      menuMocks,
    };
  };

  const renderLayout = async (userActive = true) => {
    const { commonData, ...other } = await getSocket();

    if (userActive) {
      commonData.sessionStore.getState().activity.setUserActive(true);
    }

    const HubLayoutTest = () => {
      return (
        <>
          <Hubs />
          <SocketNotificationListener />
        </>
      );
    };

    const routes = createDataFetchRoutes([
      {
        path: '/hubs/:session?/:id?/*',
        Component: HubLayoutTest,
      },
    ]);

    const renderData = renderDataRoutes(routes, commonData, {
      routerProps: { initialEntries: ['/hubs'] },
      viewType: VIEW_FIXED_HEIGHT,
    });

    const userEvent = setupUserEvent();
    return { ...commonData, ...renderData, ...other, userEvent };
  };

  test('should render', async () => {
    const renderResult = await renderLayout();
    const { getByText, queryByText, router } = renderResult;

    await waitSessionsLoaded(queryByText);

    // Check messages
    await waitFor(() => expect(getByText(Hub1MessageMe.text)).toBeTruthy());

    // Open user list
    await toggleCheckboxValue('User list', renderResult);

    await waitFor(() => expect(getByText(Hub1Bot.nick)).toBeTruthy());

    await navigateToUrl('/', router);
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
    sessionStore.getState().hubs.removeSession(HubADC1);
    sessionStore.getState().hubs.removeSession(HubADC2);
    sessionStore.getState().hubs.removeSession(HubADC3);
    sessionStore.getState().hubs.removeSession(HubNMDC1);

    // We should be redirected to the new session layout
    await waitForUrl('/hubs/new', router);
    await waitForData('Loading data...', queryByText);

    // Type the hub name
    const combobox = getByRole('combobox');
    const input = within(combobox).getByRole('textbox');
    await userEvent.type(input, HubADC1.identity.name);

    // Wait until suggestion appears, then select via keyboard
    await findByText(HubADC1.identity.name);
    await userEvent.keyboard('{ArrowDown}{Enter}');

    // Click the hub
    // const hub1Item = getByText(HubADC1.identity.name);
    // await userEvent.click(hub1Item!);

    // We should be redirected to the new session
    await waitFor(() =>
      expect(sessionStore.getState().hubs.activeSessionId).toEqual(HubADC1.id),
    );

    await waitFor(() => expect(getByText(Hub1MessageMe.text)).toBeTruthy());
  });

  describe('prompts', () => {
    test('should handle redirect prompt', async () => {
      const { queryByText, getByText, mockStoreListeners, findByText, userEvent } =
        await renderLayout(false);

      const onRedirect = vi.fn();
      server.addRequestHandler(
        'POST',
        `${HubConstants.SESSIONS_URL}/${HubADC1.id}/redirect`,
        HubADC1,
        onRedirect,
      );

      await waitSessionsLoaded(queryByText);

      // Fire the redirect prompt event
      mockStoreListeners.hub.updated.fire(
        {
          connect_state: {
            data: {
              hub_url: 'adcs://test_redirect.org:12345',
            },
            id: 'redirect',
            str: 'Redirect',
          },
          encryption: null,
        },
        HubADC1.id,
      );

      await findByText('Redirect requested');

      // Accept it
      await userEvent.click(
        getByText('Accept redirect to adcs://test_redirect.org:12345'),
      );

      // Check that the request was sent
      await waitExpectRequestToMatchSnapshot(onRedirect);
    });

    test('should handle password prompt', async () => {
      const {
        findByText,
        getByText,
        queryByText,
        mockStoreListeners,
        getByPlaceholderText,
        userEvent,
      } = await renderLayout();

      const onPassword = vi.fn();
      server.addRequestHandler(
        'POST',
        `${HubConstants.SESSIONS_URL}/${HubADC2.id}/password`,
        HubADC1,
        onPassword,
      );

      await waitSessionsLoaded(queryByText);

      // Switch to the disconnected session
      const session2MenuItem = queryByText(HubADC2.identity.name);
      await userEvent.click(session2MenuItem!);

      await findByText('Connection timeout');

      // Fire the password prompt event
      mockStoreListeners.hub.updated.fire(
        {
          connect_state: {
            id: 'password',
            str: 'Password requested',
          },
        },
        HubADC2.id,
      );

      await findByText('Password required');

      // Fill in the password
      const passwordInput = getByPlaceholderText('Password');
      await userEvent.type(passwordInput, 'testpassword');

      await userEvent.click(getByText('Submit'));

      // Check that the request was sent
      await waitExpectRequestToMatchSnapshot(onPassword);
    });
  });
});
