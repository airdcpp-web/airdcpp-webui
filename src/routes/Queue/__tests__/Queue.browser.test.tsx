import { afterEach, beforeEach, describe, expect, test } from 'vitest';

import { renderDataRoutes } from '@/tests/render/test-renderers';

import { initCommonDataMocks } from '@/tests/mocks/mock-data-common';

import { getMockServer, MockServer } from '@/tests/mocks/mock-server';
import { installTableMocks } from '@/tests/mocks/mock-table';
import QueueConstants from '@/constants/QueueConstants';
import Queue from '../components/Queue';
import { QueueBundlesListResponse } from '@/tests/mocks/api/queue-bundles';
import { waitFor } from '@testing-library/dom';
import { VIEW_FIXED_HEIGHT } from '@/tests/render/test-containers';
import { waitForUrl } from '@/tests/helpers/test-helpers';

describe('Queue layout', () => {
  let server: MockServer;

  beforeEach(() => {
    server = getMockServer();
  });

  afterEach(() => {
    server.stop();
  });

  const getSocket = async () => {
    const commonData = await initCommonDataMocks(
      server /*, {
      socketOptions: {
        logLevel: 'verbose',
      },
    }*/,
    );
    const tableMocks = installTableMocks(QueueBundlesListResponse, {
      server,
      moduleUrl: QueueConstants.MODULE_URL,
      viewName: QueueConstants.BUNDLE_VIEW_ID,
    });

    return { commonData, server, tableMocks };
  };

  const renderLayout = async () => {
    const { commonData, server, ...other } = await getSocket();

    const QueueLayoutTest = () => {
      return <Queue />;
    };

    const routes = [
      {
        index: true,
        Component: () => <div>Index page</div>,
      },
      {
        path: '/queue/*',
        Component: QueueLayoutTest,
      },
    ];

    const renderData = renderDataRoutes(routes, commonData, {
      routerProps: { initialEntries: ['/queue'] },
      viewType: VIEW_FIXED_HEIGHT,
    });

    return { ...renderData, ...other, ...commonData };
  };

  test('should render', async () => {
    const { getByRole, queryByText, router } = await renderLayout();

    await waitFor(() => expect(getByRole('grid')).toBeTruthy());
    await waitFor(() =>
      expect(queryByText(QueueBundlesListResponse[0].name)).toBeTruthy(),
    );

    await router.navigate('/');
    await waitForUrl('/', router);
  });
});
