import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { waitFor, within } from '@testing-library/react';

import { renderDataRoutes } from '@/tests/render/test-renderers';

import { CommonDataMocks, initCommonDataMocks } from '@/tests/mocks/mock-data-common';

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
  FilelistMeResponse,
  FilelistPendingResponse,
  FilelistRootItemsList,
  FilelistStateLoaded,
  FilelistStatePending,
} from '@/tests/mocks/api/filelist';
import Filelists from '../components/Filelists';
import { installTableMocks } from '@/tests/mocks/mock-table';
import { selectTopLayoutSession } from '@/tests/helpers/test-session-helpers';
import {
  installBasicSessionHandlers,
  installUserSearchFieldMocks,
  waitSessionsLoaded,
} from '@/tests/mocks/mock-session';
import { clickMenuItem, openIconMenu, openMenu } from '@/tests/helpers/test-menu-helpers';
import { installActionMenuMocks } from '@/components/action-menu/__tests__/test-action-menu-helpers';
import MenuConstants from '@/constants/MenuConstants';
import { RemoteMenuGrouped1 } from '@/tests/mocks/api/menu';
import QueueConstants from '@/constants/QueueConstants';
import { QueueBundleCreateFileResponse } from '@/tests/mocks/api/queue-bundles';
import {
  navigateToUrl,
  waitExpectRequestToMatchSnapshot,
  waitForUrl,
} from '@/tests/helpers/test-helpers';
import { installShareProfileMocks } from '@/tests/mocks/mock-share';
import { HistoryEntryEnum } from '@/constants/HistoryConstants';
import { HistoryFilelistResponse } from '@/tests/mocks/api/history';
import { getHistoryUrl } from '@/routes/Sidebar/components/RecentLayout';
import { ShareProfile2 } from '@/tests/mocks/api/share-profiles';
import { formatProfileNameWithSize } from '@/utils/ShareProfileUtils';

// tslint:disable:no-empty
describe('Filelists', () => {
  let server: MockServer;

  beforeEach(() => {
    server = getMockServer();
  });

  afterEach(() => {
    server.stop();
  });

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

    const filelistMeTableMocks = installTableMocks(FilelistRootItemsList.items, {
      server,
      moduleUrl: FilelistConstants.MODULE_URL,
      viewName: FilelistConstants.VIEW_ID,
      entityId: FilelistMeResponse.id,
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

      filelistMeMocks: {
        table: filelistMeTableMocks,
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

  test('should render', async () => {
    const renderResult = await renderLayout();
    const { findByText, filelist1Mocks, filelist2Mocks, router } = renderResult;

    // Check content
    await findByText(FilelistRootItemsList.items[0].name);
    // expect(filelist1Mocks.onSessionRead).toHaveBeenCalled();

    // Open a different session
    await selectTopLayoutSession(
      FilelistPendingResponse.user.nicks,
      renderResult,
      filelist2Mocks.onSessionRead,
    );

    // Check content
    await findByText('Download pending');

    expect(filelist1Mocks.onSessionRead).not.toHaveBeenCalled();

    await navigateToUrl('/', router);
    await filelist1Mocks.table.waitStopped();
  });

  test('should navigate between directories', async () => {
    const filelist = FilelistLoadedResponse;
    const clickedDirectory = FilelistGetFilelistItemDirectoryResponse;

    // Filelist handlers
    const onChangeDirectoryChild = vi.fn();
    server.addRequestHandler(
      'POST',
      `${FilelistConstants.SESSIONS_URL}/${filelist.id}/directory`,
      undefined,
      onChangeDirectoryChild,
    );

    const renderResult = await renderLayout();
    const {
      getByText,
      findByText,
      filelist1Mocks,
      router,
      userEvent,
      getByPlaceholderText,
      mockStoreListeners,
    } = renderResult;

    const expectFilterInputFocused = () => {
      expect(getByPlaceholderText('Filter...')).toHaveFocus();
    };

    // Check content
    await findByText(clickedDirectory.name);
    expectFilterInputFocused();

    // Go to a child directory
    await userEvent.click(getByText(clickedDirectory.name));
    await waitExpectRequestToMatchSnapshot(onChangeDirectoryChild);

    // Set as loading
    mockStoreListeners.filelist.updated.fire(
      {
        location: {
          ...FilelistGetFilelistItemDirectoryResponse,
          complete: false,
        },
        read: true,
      },
      filelist.id,
    );

    await waitFor(() => {
      expect(router.state.location.state.directory).toEqual(clickedDirectory.path);
    });

    mockStoreListeners.filelist.updated.fire(
      {
        state: FilelistStatePending,
      },
      filelist.id,
    );

    await findByText(FilelistStatePending.str);
    await waitFor(() =>
      expect(filelist1Mocks.table.mockTableManager.isActive()).toBe(false),
    );

    // Set as loaded
    filelist1Mocks.table.mockTableManager.setItems(
      FilelistDirectoryItemsList.items,
      false,
    );
    mockStoreListeners.filelist.updated.fire(
      {
        location: FilelistGetFilelistItemDirectoryResponse,
        read: true,
      },
      filelist.id,
    );

    mockStoreListeners.filelist.updated.fire(
      {
        state: FilelistStateLoaded,
      },
      filelist.id,
    );

    await findByText(FilelistDirectoryItemsList.items[0].name);
    expectFilterInputFocused();

    // Go back to the root
    const onChangeDirectoryRoot = vi.fn();
    server.addRequestHandler(
      'POST',
      `${FilelistConstants.SESSIONS_URL}/${FilelistLoadedResponse.id}/directory`,
      undefined,
      onChangeDirectoryRoot,
    );

    await userEvent.click(getByText('Root'));
    await waitExpectRequestToMatchSnapshot(onChangeDirectoryRoot);

    // Fire the location change event
    mockStoreListeners.filelist.updated.fire(
      {
        location: FilelistGetFilelistItemDirectoryResponse,
        read: true,
      },
      filelist.id,
    );

    filelist1Mocks.table.mockTableManager.setItems(FilelistRootItemsList.items);

    await findByText(FilelistRootItemsList.items[0].name);
    expectFilterInputFocused();

    await navigateToUrl('/', router);
    await filelist1Mocks.table.waitStopped();
  });

  test('should open item details dialog', async () => {
    server.addRequestHandler(
      'GET',
      // eslint-disable-next-line max-len
      `${FilelistConstants.MODULE_URL}/${FilelistLoadedResponse.id}/items/${FilelistGetFilelistItemDirectoryResponse.id}`,
      FilelistGetFilelistItemDirectoryResponse,
    );

    const renderResult = await renderLayout();
    const { findByText, router, findByRole, userEvent, filelist1Mocks } = renderResult;

    const directoryItem = FilelistGetFilelistItemDirectoryResponse;
    await findByText(directoryItem.name);

    // Open details dialog
    const contentCaption = `${directoryItem.name} actions`;
    await openIconMenu(contentCaption, renderResult);
    await clickMenuItem('Details', renderResult);

    const dialog = await findByRole('dialog');

    // Close it
    userEvent.click(within(dialog).getByRole('button', { name: 'Close' }));
    await waitForUrl(`/filelists/session/${FilelistLoadedResponse.id}`, router);

    await navigateToUrl('/', router);
    await filelist1Mocks.table.waitStopped();
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
      const { findByText, filelist1Mocks, router } = renderResult;

      filelist1Mocks.table.mockTableManager.setItems(FilelistDirectoryItemsList.items);

      const fileItem = FilelistGetFilelistItemFileResponse;
      await findByText(fileItem.name);

      // Download a file
      const contentCaption = `${fileItem.name} actions`;
      await openIconMenu(contentCaption, renderResult);
      await clickMenuItem('Download', renderResult);

      await waitExpectRequestToMatchSnapshot(onDownloadFile);

      await navigateToUrl('/', router);
      await filelist1Mocks.table.waitStopped();
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
      const { findByText, router, filelist1Mocks } = renderResult;

      const directoryItem = FilelistGetFilelistItemDirectoryResponse;
      await findByText(directoryItem.name);

      // Download a directory
      const contentCaption = `${directoryItem.name} actions`;
      await openIconMenu(contentCaption, renderResult);
      await clickMenuItem('Download', renderResult);

      await waitExpectRequestToMatchSnapshot(onDownloadDirectory);
      await navigateToUrl('/', router);
      await filelist1Mocks.table.waitStopped();
    });
  });

  describe('new session', () => {
    const installNewLayoutMocks = (
      newFilelistResponse: API.FilelistSession,
      { mockStoreListeners }: CommonDataMocks,
      createUrl: string = FilelistConstants.SESSIONS_URL,
    ) => {
      server.addRequestHandler(
        'GET',
        getHistoryUrl(HistoryEntryEnum.FILELIST),
        HistoryFilelistResponse,
      );

      installShareProfileMocks(server);
      installUserSearchFieldMocks(server);

      const onSessionCreated = vi.fn(() => {
        mockStoreListeners.filelist.created.fire(newFilelistResponse);
      });
      server.addRequestHandler('POST', createUrl, newFilelistResponse, onSessionCreated);

      return onSessionCreated;
    };

    test('should open local share profile', async () => {
      const renderResult = await renderLayout();
      const {
        queryByText,
        sessionStore,
        router,
        findByText,
        formatter,
        filelistMeMocks,
      } = renderResult;

      const onSessionCreated = installNewLayoutMocks(
        FilelistMeResponse,
        renderResult,
        `${FilelistConstants.SESSIONS_URL}/self`,
      );

      await waitSessionsLoaded(queryByText);

      // Remove existing sessions
      sessionStore.getState().filelists.removeSession(FilelistLoadedResponse);
      sessionStore.getState().filelists.removeSession(FilelistPendingResponse);
      sessionStore.getState().filelists.removeSession(FilelistMeResponse);

      // We should be redirected to the new session layout
      await waitForUrl('/filelists/new', router);

      await findByText('Browse own share...');

      await openMenu('Browse own share...', renderResult);
      await clickMenuItem(
        formatProfileNameWithSize(ShareProfile2, formatter),
        renderResult,
      );

      // We should be redirected to the new session
      await waitFor(() =>
        expect(sessionStore.getState().filelists.activeSessionId).toEqual(
          FilelistMeResponse.id,
        ),
      );

      await findByText(FilelistMeResponse.share_profile.str);

      await waitExpectRequestToMatchSnapshot(onSessionCreated);

      await navigateToUrl('/', router);
      await filelistMeMocks.table.waitStopped();
    });

    test('open remote session', async () => {
      const renderResult = await renderLayout();
      const {
        queryByText,
        sessionStore,
        router,
        findByRole,
        findByText,
        getByText,
        userEvent,
        filelist1Mocks,
      } = renderResult;

      const onSessionCreated = installNewLayoutMocks(
        FilelistLoadedResponse,
        renderResult,
      );

      await waitSessionsLoaded(queryByText);

      // Remove existing sessions
      sessionStore.getState().filelists.removeSession(FilelistLoadedResponse);
      sessionStore.getState().filelists.removeSession(FilelistPendingResponse);
      sessionStore.getState().filelists.removeSession(FilelistMeResponse);

      // We should be redirected to the new session layout
      await waitForUrl('/filelists/new', router);

      // Type the user nick
      const input = await findByRole('combobox');
      await userEvent.type(input, FilelistLoadedResponse.user.nicks);

      // Click the user
      const user1Item = await findByText(FilelistLoadedResponse.user.nicks);
      await userEvent.click(user1Item!);

      // We should be redirected to the new session
      await waitFor(() =>
        expect(sessionStore.getState().filelists.activeSessionId).toEqual(
          FilelistLoadedResponse.id,
        ),
      );

      await waitFor(() =>
        expect(getByText(FilelistLoadedResponse.user.nicks)).toBeTruthy(),
      );

      await waitExpectRequestToMatchSnapshot(onSessionCreated);

      await navigateToUrl('/', router);
      await filelist1Mocks.table.waitStopped();
    });
  });
});
