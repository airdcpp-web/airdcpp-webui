import { afterEach, beforeEach, describe, expect, test } from 'vitest';

import { renderDataRoutes } from '@/tests/render/test-renderers';

import { initCommonDataMocks } from '@/tests/mocks/mock-data-common';

import { getMockServer, MockServer } from '@/tests/mocks/mock-server';
import { installTableMocks } from '@/tests/mocks/mock-table';

import { waitFor } from '@testing-library/dom';
import { waitForUrl } from '@/tests/helpers/test-helpers';

import { ShareRootListResponse } from '@/tests/mocks/api/share-roots';
import ShareRootConstants from '@/constants/ShareRootConstants';
import Share from '../components/Share';

import { VIEW_FIXED_HEIGHT } from '@/tests/render/test-containers';
import { installShareProfileMocks } from '@/tests/mocks/mock-share';

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
    const tableMocks = installTableMocks(ShareRootListResponse, {
      server,
      moduleUrl: ShareRootConstants.MODULE_URL,
      viewName: ShareRootConstants.VIEW_ID,
    });

    installShareProfileMocks(server);

    return { commonData, server, tableMocks };
  };

  const renderLayout = async () => {
    const { commonData, server, ...other } = await getSocket();

    const ShareLayoutTest = () => {
      return <Share />;
    };

    const routes = [
      {
        index: true,
        Component: () => <div>Index page</div>,
      },
      {
        path: '/share/*',
        Component: ShareLayoutTest,
      },
    ];

    const renderData = renderDataRoutes(routes, commonData, {
      routerProps: { initialEntries: ['/share'] },
      viewType: VIEW_FIXED_HEIGHT,
    });

    return { ...renderData, ...other, ...commonData };
  };

  test('should render', async () => {
    const { getByRole, queryByText, router } = await renderLayout();

    await waitFor(() => expect(getByRole('grid')).toBeTruthy());

    const root = ShareRootListResponse[0];
    await waitFor(() => expect(queryByText(root.virtual_name)).toBeTruthy());

    await router.navigate('/');
    await waitForUrl('/', router);
  });
});
