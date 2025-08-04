import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';

import { renderDataRoutes } from '@/tests/render/test-renderers';

import { initCommonDataMocks } from '@/tests/mocks/mock-data-common';
import Home from '../components/Home';
import { getMockSession } from '@/tests/mocks/mock-session';
import SettingConstants from '@/constants/SettingConstants';
import { clickButton, expectResponseToMatchSnapshot } from '@/tests/helpers/test-helpers';

import createFetchMock from 'vitest-fetch-mock';
import { ReleaseFeedRSSContent } from '@/tests/mocks/http/rss-feed-content';
import { ExtensionReleasesContent } from '@/tests/mocks/http/extension-releases-content';
import {
  installApplicationWidgetMocks,
  installExtensionWidgetMocks,
  installTransferWidgetMocks,
} from '@/tests/mocks/mock-widget';
import { waitFor } from '@testing-library/dom';
import { getMockServer, MockServer } from '@/tests/mocks/mock-server';

const fetchMocker = createFetchMock(vi);

describe('Home layout', () => {
  let server: MockServer;
  const getSocket = async () => {
    const commonData = await initCommonDataMocks(server);
    commonData.appStore.getState().login.onLoginCompleted(
      commonData.socket,
      {
        ...getMockSession(),
        wizard_pending: true,
      },
      true,
    );

    installTransferWidgetMocks(server);
    installApplicationWidgetMocks(server);
    installExtensionWidgetMocks(server);

    return { commonData, server };
  };

  const renderLayout = async (settings: object = {}) => {
    const { commonData, server, ...other } = await getSocket();

    const HomeLayoutTest = () => {
      return <Home />;
    };

    const routes = [
      {
        path: '/home/*',
        Component: HomeLayoutTest,
      },
    ];

    const renderData = renderDataRoutes(routes, commonData, {
      routerProps: { initialEntries: ['/home'] },
    });

    return { ...renderData, ...other, ...commonData };
  };

  beforeEach(() => {
    server = getMockServer();

    fetchMocker.enableMocks();

    fetchMocker.mockIf(/.*$/, (req) => {
      if (req.url.includes('feed.xml')) {
        return ReleaseFeedRSSContent;
      } else if (req.url.includes('airdcpp-extensions-public')) {
        return ExtensionReleasesContent;
      } else {
        return {
          status: 404,
          body: 'Not Found',
        };
      }
    });
  });

  afterEach(() => {
    server.stop();
  });

  test('should handle new user intro', async () => {
    const { getByRole, queryByRole } = await renderLayout();

    const onIntroSeen = vi.fn();
    server.addRequestHandler(
      'POST',
      SettingConstants.ITEMS_SET_URL,
      undefined,
      onIntroSeen,
    );

    const wizardCloseButtonCaption = "Close and don't show again";
    clickButton(wizardCloseButtonCaption, getByRole);

    await waitFor(() => {
      expect(onIntroSeen).toHaveBeenCalledTimes(1);
    });

    expectResponseToMatchSnapshot(onIntroSeen);

    await waitFor(() =>
      expect(
        queryByRole('button', { name: wizardCloseButtonCaption }),
      ).not.toBeInTheDocument(),
    );
  });
});
