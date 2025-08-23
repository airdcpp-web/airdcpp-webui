import { afterEach, beforeEach, describe, expect, test } from 'vitest';

import { renderDataRoutes } from '@/tests/render/test-renderers';

import { initCommonDataMocks } from '@/tests/mocks/mock-data-common';

import { getMockServer, MockServer } from '@/tests/mocks/mock-server';
import { installTableMocks } from '@/tests/mocks/mock-table';
import QueueConstants from '@/constants/QueueConstants';
import Queue from '../components/Queue';
import {
  QueueBundleRunningResponse,
  QueueBundlesListResponse,
  QueueBundleSourceListResponse,
} from '@/tests/mocks/api/queue-bundles';
import { waitFor } from '@testing-library/dom';
import { clickButton, navigateToUrl, waitForUrl } from '@/tests/helpers/test-helpers';
import { QueueFilesListResponse } from '@/tests/mocks/api/queue-files';

describe('Queue layout', () => {
  let server: MockServer;

  beforeEach(() => {
    server =
      getMockServer(/*{
      loggerOptions: {
        logLevel: 'verbose',
      },
    }*/);
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

    // Tables
    const bundleTableMocks = installTableMocks(QueueBundlesListResponse, {
      server,
      moduleUrl: QueueConstants.MODULE_URL,
      viewName: QueueConstants.BUNDLE_VIEW_ID,
    });

    const fileTableMocks = installTableMocks(QueueFilesListResponse, {
      server,
      moduleUrl: QueueConstants.MODULE_URL,
      viewName: QueueConstants.FILE_VIEW_ID,
    });

    // Bundle dialog
    server.addRequestHandler(
      'GET',
      `queue/bundles/${QueueBundleRunningResponse.id}`,
      QueueBundleRunningResponse,
    );

    // Sources
    server.addRequestHandler(
      'GET',
      `queue/bundles/${QueueBundleRunningResponse.id}/sources`,
      QueueBundleSourceListResponse,
    );

    server.addSubscriptionHandler(
      QueueConstants.MODULE_URL,
      QueueConstants.BUNDLE_SOURCES,
    );

    return { commonData, server, bundleTableMocks, fileTableMocks };
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
    });

    return { ...renderData, ...other, ...commonData };
  };

  test('should render', async () => {
    const { getByRole, queryByText, router } = await renderLayout();

    await waitFor(() => expect(getByRole('grid')).toBeTruthy());

    const bundle = QueueBundleRunningResponse;
    await waitFor(() => expect(queryByText(bundle.name)).toBeTruthy());

    await navigateToUrl('/', router);
  });

  test('should open bundle files dialog', async () => {
    const { getByRole, queryByText, router } = await renderLayout();

    await waitFor(() => expect(getByRole('grid')).toBeTruthy());

    const bundle = QueueBundleRunningResponse;
    await waitFor(() => expect(queryByText(bundle.name)).toBeTruthy());

    const contentCaption = bundle.type.str;
    clickButton(contentCaption, getByRole);

    await waitFor(() => expect(getByRole('dialog')).toBeTruthy());

    const file = QueueFilesListResponse[0];
    await waitFor(() => expect(queryByText(file.name)).toBeTruthy());

    clickButton('Close', getByRole);
    await waitForUrl('/queue', router);

    await navigateToUrl('/', router);
  });

  test('should open bundle sources dialog', async () => {
    const { getByRole, queryByText, router } = await renderLayout();

    await waitFor(() => expect(getByRole('grid')).toBeTruthy());

    const bundle = QueueBundleRunningResponse;
    await waitFor(() => expect(queryByText(bundle.name)).toBeTruthy());

    const contentCaption = bundle.sources.str;
    clickButton(contentCaption, getByRole);

    await waitFor(() => expect(getByRole('dialog')).toBeTruthy());

    const source = QueueBundleSourceListResponse[0];
    await waitFor(() => expect(queryByText(source.user.nicks)).toBeTruthy());

    clickButton('Close', getByRole);
    await waitForUrl('/queue', router);

    await navigateToUrl('/', router);
  });
});
