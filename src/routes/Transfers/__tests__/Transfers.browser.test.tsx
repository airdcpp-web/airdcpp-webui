import { afterEach, beforeEach, describe, expect, test } from 'vitest';

import { renderDataRoutes } from '@/tests/render/test-renderers';

import { initCommonDataMocks } from '@/tests/mocks/mock-data-common';

import { getMockServer, MockServer } from '@/tests/mocks/mock-server';
import { installTableMocks } from '@/tests/mocks/mock-table';

import { waitFor } from '@testing-library/dom';
import { waitForUrl } from '@/tests/helpers/test-helpers';

import '@/style.css';

import { VIEW_FIXED_HEIGHT } from '@/tests/render/test-containers';
import { TransferListResponse } from '@/tests/mocks/api/transfers';
import TransferConstants from '@/constants/TransferConstants';
import Transfers from '../components/Transfers';

describe('Transfer layout', () => {
  let server: MockServer;

  beforeEach(() => {
    server = getMockServer();
  });

  afterEach(() => {
    server.stop();
  });

  const getSocket = async () => {
    const commonData = await initCommonDataMocks(server);

    // Tables
    const tableMocks = installTableMocks(TransferListResponse, {
      server,
      moduleUrl: TransferConstants.MODULE_URL,
      viewName: TransferConstants.VIEW_ID,
    });

    return { commonData, server, tableMocks };
  };

  const renderLayout = async () => {
    const { commonData, server, ...other } = await getSocket();

    const TransfersLayoutTest = () => {
      return <Transfers />;
    };

    const routes = [
      {
        index: true,
        Component: () => <div>Index page</div>,
      },
      {
        path: '/transfers/*',
        Component: TransfersLayoutTest,
      },
    ];

    const renderData = renderDataRoutes(routes, commonData, {
      routerProps: { initialEntries: ['/transfers'] },
      viewType: VIEW_FIXED_HEIGHT,
    });

    return { ...renderData, ...other, ...commonData };
  };

  test('should render', async () => {
    const { getByRole, queryByText, router } = await renderLayout();

    await waitFor(() => expect(getByRole('grid')).toBeTruthy());

    const transfer = TransferListResponse[0];
    await waitFor(() => expect(queryByText(transfer.name)).toBeTruthy());

    await router.navigate('/');
    await waitForUrl('/', router);
  });
});
