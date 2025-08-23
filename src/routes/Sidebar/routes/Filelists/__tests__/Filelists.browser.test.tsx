import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { RenderResult, waitFor, within } from '@testing-library/react';

import { renderDataRoutes } from '@/tests/render/test-renderers';

import { initCommonDataMocks } from '@/tests/mocks/mock-data-common';

import * as API from '@/types/api';

import SocketNotificationListener from '@/components/main/notifications/SocketNotificationListener';

import { setupUserEvent } from '@/tests/helpers/test-form-helpers';
import { VIEW_FIXED_HEIGHT } from '@/tests/render/test-containers';
import { getMockServer, MockServer } from '@/tests/mocks/mock-server';
import { createDataFetchRoutes } from '@/tests/helpers/test-route-helpers';
import FilelistConstants from '@/constants/FilelistConstants';
import {
  FilelistDirectoryDownloadResponse,
  FilelistDirectoryItemsList,
  FilelistGetFilelistItemDirectoryResponse,
  FilelistGetFilelistItemFileResponse,
  FilelistLoadedResponse,
  FilelistPendingResponse,
  FilelistRootItemsList,
} from '@/tests/mocks/api/filelist';
import Filelists from '../components/Filelists';
import { installTableMocks } from '@/tests/mocks/mock-table';
import { selectTopLayoutSession } from '@/tests/helpers/test-session-helpers';
import { installBasicSessionHandlers } from '@/tests/mocks/mock-session';
import { clickMenuItem, openIconMenu } from '@/tests/helpers/test-menu-helpers';
import { installActionMenuMocks } from '@/components/action-menu/__tests__/test-action-menu-helpers';
import MenuConstants from '@/constants/MenuConstants';
import { RemoteMenuGrouped1 } from '@/tests/mocks/api/menu';
import QueueConstants from '@/constants/QueueConstants';
import { QueueBundleCreateFileResponse } from '@/tests/mocks/api/queue-bundles';
import {
  clickButton,
  navigateToUrl,
  waitExpectRequestToMatchSnapshot,
  waitForUrl,
} from '@/tests/helpers/test-helpers';

// tslint:disable:no-empty
describe('Filelists', () => {
  let server: MockServer;

  const getSocket = async () => {
    const commonData = await initCommonDataMocks(server, {
      permissions: [
        API.AccessEnum.FILELISTS_VIEW,
        API.AccessEnum.FILELISTS_EDIT,
        API.AccessEnum.DOWNLOAD,
      ],
    });

    // Messages
    const session1Mocks = installBasicSessionHandlers(
      FilelistConstants.SESSIONS_URL,
      FilelistLoadedResponse.id,
      server,
    );
    const session2Mocks = installBasicSessionHandlers(
      FilelistConstants.SESSIONS_URL,
      FilelistPendingResponse.id,
      server,
    );

    // Tables
    const filelist1TableMocks = installTableMocks(FilelistRootItemsList.items, {
      server,
      moduleUrl: FilelistConstants.MODULE_URL,
      viewName: FilelistConstants.VIEW_ID,
      entityId: FilelistLoadedResponse.id,
    });

    // Menus
    const itemMenuMocks = installActionMenuMocks(
      MenuConstants.FILELIST_ITEM,
      [RemoteMenuGrouped1],
      server,
    );

    return {
      commonData,

      filelist1Mocks: {
        ...session1Mocks,
        table: filelist1TableMocks,
      },

      filelist2Mocks: {
        ...session2Mocks,
      },

      itemMenuMocks,
    };
  };

  const renderLayout = async () => {
    const { commonData, ...other } = await getSocket();
    const { sessionStore } = commonData;
    sessionStore.getState().activity.setUserActive(true);

    const FilelistLayoutTest = () => {
      return (
        <>
          <Filelists />
          <SocketNotificationListener />
        </>
      );
    };

    const routes = createDataFetchRoutes([
      {
        path: '/filelists/:session?/:id?/*',
        Component: FilelistLayoutTest,
      },
    ]);

    const renderData = renderDataRoutes(routes, commonData, {
      viewType: VIEW_FIXED_HEIGHT,
      routerProps: { initialEntries: ['/filelists'] },
    });

    const userEvent = setupUserEvent();
    return { ...commonData, ...renderData, ...other, userEvent };
  };

  beforeEach(() => {
    server = getMockServer();
  });

  afterEach(() => {
    server.stop();
  });

  const waitText = async (text: string, getByText: RenderResult['getByText']) => {
    await waitFor(() => expect(getByText(text, { exact: false })).toBeTruthy());
  };

  test('should render', async () => {
    const renderResult = await renderLayout();
    const { getByText, filelist1Mocks, filelist2Mocks, router } = renderResult;

    // Check content
    await waitText(FilelistRootItemsList.items[0].name, getByText);
    // expect(filelist1Mocks.onSessionRead).toHaveBeenCalled();

    // Open a different session
    await selectTopLayoutSession(
      FilelistPendingResponse.user.nicks,
      renderResult,
      filelist2Mocks.onSessionRead,
    );

    // Check content
    await waitText('Download pending', getByText);

    expect(filelist1Mocks.onSessionRead).not.toHaveBeenCalled();

    await navigateToUrl('/', router);
  });

  test('should open item details dialog', async () => {
    server.addRequestHandler(
      'GET',
      // eslint-disable-next-line max-len
      `${FilelistConstants.MODULE_URL}/${FilelistLoadedResponse.id}/items/${FilelistGetFilelistItemDirectoryResponse.id}`,
      FilelistGetFilelistItemDirectoryResponse,
    );

    const renderResult = await renderLayout();
    const { getByText, router, findByRole, userEvent } = renderResult;

    const directoryItem = FilelistGetFilelistItemDirectoryResponse;
    await waitText(directoryItem.name, getByText);

    // Open details dialog
    const contentCaption = `${directoryItem.name} actions`;
    await openIconMenu(contentCaption, renderResult);
    await clickMenuItem('Details', renderResult);

    const dialog = await findByRole('dialog');

    // Close it
    userEvent.click(within(dialog).getByRole('button', { name: 'Close' }));
    await waitForUrl(`/filelists/session/${FilelistLoadedResponse.id}`, router);

    await navigateToUrl('/', router);
  });

  describe('downloads', () => {
    test('should download files', async () => {
      // Download handler
      const onDownloadFile = vi.fn();
      server.addRequestHandler(
        'POST',
        `${QueueConstants.BUNDLES_URL}/file`,
        QueueBundleCreateFileResponse,
        onDownloadFile,
      );

      const renderResult = await renderLayout();
      const { getByText, filelist1Mocks, router } = renderResult;

      filelist1Mocks.table.mockTableManager.setItems(FilelistDirectoryItemsList.items);

      const fileItem = FilelistGetFilelistItemFileResponse;
      await waitText(fileItem.name, getByText);

      // Download a file
      const contentCaption = `${fileItem.name} actions`;
      await openIconMenu(contentCaption, renderResult);
      await clickMenuItem('Download', renderResult);

      await waitExpectRequestToMatchSnapshot(onDownloadFile);
      await navigateToUrl('/', router);
    });

    test('should download directories', async () => {
      // Download handler
      const onDownloadDirectory = vi.fn();
      server.addRequestHandler(
        'POST',
        FilelistConstants.DIRECTORY_DOWNLOADS_URL,
        FilelistDirectoryDownloadResponse,
        onDownloadDirectory,
      );

      const renderResult = await renderLayout();
      const { getByText, router } = renderResult;

      const directoryItem = FilelistGetFilelistItemDirectoryResponse;
      await waitText(directoryItem.name, getByText);

      // Download a directory
      const contentCaption = `${directoryItem.name} actions`;
      await openIconMenu(contentCaption, renderResult);
      await clickMenuItem('Download', renderResult);

      await waitExpectRequestToMatchSnapshot(onDownloadDirectory);
      await navigateToUrl('/', router);
    });
  });
});
