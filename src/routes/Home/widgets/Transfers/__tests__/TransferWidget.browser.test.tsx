import { afterEach, beforeAll, beforeEach, describe, expect, test } from 'vitest';
import { waitFor } from '@testing-library/dom';

import { renderDataRoutes } from '@/tests/render/test-renderers';

import { TransferWidgetInfo } from '../';
import { installSvgMocks } from '@/tests/mocks/mock-svg';
import { getWidgetRenderRouteContainer } from '@/tests/layouts/test-widget';
import { initCommonDataMocks } from '@/tests/mocks/mock-data-common';
import { installTransferWidgetMocks } from '@/tests/mocks/mock-widget';
import { getMockServer, MockServer } from '@/tests/mocks/mock-server';

describe('Transfer widget', () => {
  let server: MockServer;
  const getSocket = async () => {
    const commonData = await initCommonDataMocks(server);

    const transferMocks = installTransferWidgetMocks(server);

    return { commonData, server, ...transferMocks };
  };

  const renderWidget = async (settings: object = {}) => {
    const { commonData, server, ...other } = await getSocket();

    const { routes, initialEntries } = getWidgetRenderRouteContainer(
      TransferWidgetInfo,
      settings,
    );

    const renderData = renderDataRoutes(routes, commonData, {
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
