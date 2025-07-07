import { afterEach, beforeAll, beforeEach, describe, expect, test } from 'vitest';
import { waitFor } from '@testing-library/dom';

import { getConnectedSocket, getMockServer } from 'airdcpp-apisocket/tests';

import { renderDataRoutes } from '@/tests/render/test-renderers';

// import * as API from '@/types/api';
// import * as UI from '@/types/ui';

import { TransferWidgetInfo } from '../';
import TransferConstants from '@/constants/TransferConstants';
import { TransferStatsResponse } from '@/tests/mocks/api/transfers';
import { installSvgMocks } from '@/tests/mocks/mock-svg';
import { getWidgetRenderRouteContainer } from '@/tests/layouts/test-widget';

describe('Transfer widget', () => {
  let server: ReturnType<typeof getMockServer>;
  const getSocket = async () => {
    const { socket } = await getConnectedSocket(server);

    server.addRequestHandler(
      'GET',
      TransferConstants.STATISTICS_URL,
      TransferStatsResponse,
    );

    const transferStats = server.addSubscriptionHandler(
      TransferConstants.MODULE_URL,
      TransferConstants.STATISTICS,
    );

    return { socket, server, transferStats };
  };

  const renderWidget = async (settings: object = {}) => {
    const { socket, server, ...other } = await getSocket();

    const { routes, initialEntries } = getWidgetRenderRouteContainer(
      TransferWidgetInfo,
      settings,
    );

    const renderData = renderDataRoutes(routes, {
      socket,
      routerProps: { initialEntries },
    });

    return { ...renderData, ...other };
  };

  beforeAll(() => {
    installSvgMocks();
  });

  beforeEach(() => {
    server = getMockServer();
  });

  afterEach(() => {
    server.stop();
  });

  describe('render', () => {
    test('should render', async () => {
      const { getByText } = await renderWidget();

      const windowSize = 400;

      Object.assign(window, {
        innerWidth: windowSize,
        innerHeight: windowSize,
        outerWidth: windowSize,
        outerHeight: windowSize,
      }).dispatchEvent(new Event('resize'));

      // Check content
      await waitFor(() => expect(getByText('Download limit')).toBeTruthy());
    }, 100000);

    test('should purge old events', async () => {
      const { getByText, getByTestId, transferStats } = await renderWidget({
        maxEvents: 10,
      });

      // Check content
      await waitFor(() => expect(getByText('Download limit')).toBeTruthy());

      for (let i = 0; i < 12; i++) {
        transferStats.fire({
          download_speed: Math.random() * 10000,
        });
      }

      const eventCount = getByTestId('transfer-widget-event-count')!;

      await waitFor(() => expect(eventCount.textContent).toEqual('10'));
    }, 100000);
  });
});
