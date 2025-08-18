import { afterEach, beforeEach, describe, expect, test } from 'vitest';

import { renderDataRoutes } from '@/tests/render/test-renderers';

import { initCommonDataMocks } from '@/tests/mocks/mock-data-common';

import { getMockServer, MockServer } from '@/tests/mocks/mock-server';
import { installTableMocks } from '@/tests/mocks/mock-table';

import { waitFor } from '@testing-library/dom';
import { waitForUrl } from '@/tests/helpers/test-helpers';

import '@/style.css';

import { VIEW_FIXED_HEIGHT } from '@/tests/render/test-containers';
import FavoriteHubConstants from '@/constants/FavoriteHubConstants';
import { FavoriteHubListResponse } from '@/tests/mocks/api/favorite-hubs';
import FavoriteHubs from '../components/FavoriteHubs';

describe('Share layout', () => {
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
    const tableMocks = installTableMocks(FavoriteHubListResponse, {
      server,
      moduleUrl: FavoriteHubConstants.MODULE_URL,
      viewName: FavoriteHubConstants.VIEW_ID,
    });

    return { commonData, server, tableMocks };
  };

  const renderLayout = async () => {
    const { commonData, server, ...other } = await getSocket();

    const FavoriteHubsLayoutTest = () => {
      return <FavoriteHubs />;
    };

    const routes = [
      {
        index: true,
        Component: () => <div>Index page</div>,
      },
      {
        path: '/favorite-hubs/*',
        Component: FavoriteHubsLayoutTest,
      },
    ];

    const renderData = renderDataRoutes(routes, commonData, {
      routerProps: { initialEntries: ['/favorite-hubs'] },
      viewType: VIEW_FIXED_HEIGHT,
    });

    return { ...renderData, ...other, ...commonData };
  };

  test('should render', async () => {
    const { getByRole, queryByText, router } = await renderLayout();

    await waitFor(() => expect(getByRole('grid')).toBeTruthy());

    const favoriteHub = FavoriteHubListResponse[0];
    await waitFor(() => expect(queryByText(favoriteHub.name)).toBeTruthy());

    await router.navigate('/');
    await waitForUrl('/', router);
  });
});
