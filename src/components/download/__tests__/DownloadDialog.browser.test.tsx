import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { waitFor, fireEvent, RenderResult } from '@testing-library/react';

import ShareConstants from '@/constants/ShareConstants';
import { ShareGetGroupedRootsResponse } from '@/tests/mocks/api/share';
import FavoriteDirectoryConstants from '@/constants/FavoriteDirectoryConstants';
import { FavoriteDirectoriesGroupedPathsResponse } from '@/tests/mocks/api/favorite-directories';
import HistoryConstants, { HistoryStringEnum } from '@/constants/HistoryConstants';
import {
  FilelistGetFilelistItemFileResponse,
  FilelistPendingResponse,
  MOCK_FILELIST_ITEM_ID,
} from '@/tests/mocks/api/filelist';
import FilesystemConstants from '@/constants/FilesystemConstants';
import {
  FilesystemDiskInfoResponse,
  FilesystemListContentResponse,
} from '@/tests/mocks/api/filesystem';
import { renderDataRoutes } from '@/tests/render/test-renderers';
import DownloadDialog, { DOWNLOAD_SELECTION_ID } from '../DownloadDialog';

import * as UI from '@/types/ui';
import * as API from '@/types/api';

import { MockHintedUser1Response } from '@/tests/mocks/api/user';

import { HistoryStringPathResponse } from '@/tests/mocks/api/history';
import {
  createTestRouteModalController,
  TestRouteModalNavigateButton,
} from '@/tests/helpers/test-dialog-helpers';
import { clickButton, waitForData } from '@/tests/helpers/test-helpers';
import { initCommonDataMocks } from '@/tests/mocks/mock-data-common';
import { getMockServer, MockServer } from '@/tests/mocks/mock-server';
import { VIEW_FIXED_HEIGHT } from '@/tests/render/test-containers';
import { activateTab } from '@/tests/helpers/test-menu-helpers';
import { setupUserEvent } from '@/tests/helpers/test-form-helpers';

// tslint:disable:no-empty
describe('DownloadDialog', () => {
  let server: MockServer;
  beforeEach(() => {
    server = getMockServer();
  });

  afterEach(() => {
    server.stop();
  });

  const getSocket = async () => {
    const commonData = await initCommonDataMocks(server);

    const onSaveHistory = vi.fn();
    const onGetDiskInfo = vi.fn();

    // Target paths fetch
    server.addRequestHandler(
      'GET',
      ShareConstants.GROUPED_ROOTS_GET_URL,
      ShareGetGroupedRootsResponse,
    );
    server.addRequestHandler(
      'GET',
      FavoriteDirectoryConstants.GROUPED_DIRECTORIES_URL,
      FavoriteDirectoriesGroupedPathsResponse,
    );
    server.addRequestHandler(
      'GET',
      `${HistoryConstants.STRINGS_URL}/${HistoryStringEnum.DOWNLOAD_DIR}`,
      HistoryStringPathResponse,
    );

    // Saving of the selected path
    server.addRequestHandler(
      'POST',
      `${HistoryConstants.STRINGS_URL}/${HistoryStringEnum.DOWNLOAD_DIR}`,
      undefined,
      onSaveHistory,
    );

    // File browser
    server.addRequestHandler(
      'POST',
      FilesystemConstants.DISK_INFO_URL,
      (request, socket) => {
        const requestData = request.data as { paths: string[] };
        const responseData = FilesystemDiskInfoResponse.filter((item) =>
          requestData.paths.includes(item.path),
        );
        return {
          code: 200,
          data: responseData,
        };
      },
      onGetDiskInfo,
    );
    server.addRequestHandler(
      'POST',
      FilesystemConstants.LIST_URL,
      FilesystemListContentResponse,
    );

    const userEvent = setupUserEvent();
    return { ...commonData, onSaveHistory, onGetDiskInfo, userEvent };
  };

  const renderDialog = async (
    modalRoute = `/home/download/${MOCK_FILELIST_ITEM_ID}`,
    routeState?: object,
  ) => {
    const commonData = await getSocket();
    const handleDownload = vi.fn<UI.DownloadHandler<API.FilelistItem>>();

    const DownloadDialogTest = () => {
      return (
        <>
          <TestRouteModalNavigateButton modalRoute={modalRoute} state={routeState} />
          <DownloadDialog
            downloadHandler={handleDownload}
            itemDataGetter={(itemId) =>
              Promise.resolve(
                // Selection ids get a distinct item each, so that a bulk
                // download can be checked per item
                String(itemId) === String(MOCK_FILELIST_ITEM_ID)
                  ? (FilelistGetFilelistItemFileResponse as API.FilelistItem)
                  : ({
                      ...FilelistGetFilelistItemFileResponse,
                      id: itemId,
                      name: `${FilelistGetFilelistItemFileResponse.name}-${itemId}`,
                    } as unknown as API.FilelistItem),
              )
            }
            userGetter={() => MockHintedUser1Response as API.HintedUser}
            sessionItem={FilelistPendingResponse}
          />
        </>
      );
    };

    const routes = [
      {
        path: '/home/*',
        Component: DownloadDialogTest,
      },
    ];

    const renderData = renderDataRoutes(routes, commonData, {
      routerProps: { initialEntries: ['/home'] },
      viewType: VIEW_FIXED_HEIGHT,
    });

    const modalController = createTestRouteModalController(renderData);
    return { ...commonData, handleDownload, modalController, ...renderData };
  };

  const expectDownloadHandlerToMatchSnapshot = (
    handleDownload: ReturnType<typeof vi.fn<UI.DownloadHandler<API.FilelistItem>>>,
  ) => {
    expect(handleDownload).toHaveBeenCalledTimes(1);
    expect(handleDownload.mock.calls[0][0]).toMatchSnapshot();
    expect(handleDownload.mock.calls[0][1]).toMatchSnapshot();
  };

  const waitDialogLoaded = async (getByRole: RenderResult['getByRole']) => {
    await waitFor(() => expect(getByRole('button', { name: 'Browse' })).toBeTruthy());
  };

  test('should load and close', async () => {
    const { getByText, getByRole, modalController } = await renderDialog();

    await modalController.openDialog();

    await waitDialogLoaded(getByRole);

    // Check content
    await waitFor(() => expect(getByText('Download')).toBeTruthy());

    await modalController.closeDialogButton('Close');
  });

  test('should handle history download', async () => {
    const { onSaveHistory, modalController, handleDownload, getByRole, queryByText } =
      await renderDialog();

    const downloadPath = HistoryStringPathResponse[0];

    await modalController.openDialog();

    await waitFor(() => expect(queryByText(downloadPath)).toBeInTheDocument());
    await waitDialogLoaded(getByRole);

    // Download
    await modalController.closeDialogText(downloadPath);

    await waitFor(() => expect(onSaveHistory).toHaveBeenCalled());

    // Check
    expectDownloadHandlerToMatchSnapshot(handleDownload);
  });

  test('should accordion path download', async () => {
    const renderResult = await renderDialog();

    const { onSaveHistory, modalController, handleDownload, getByRole, queryByText } =
      renderResult;

    const pathGroup = FavoriteDirectoriesGroupedPathsResponse[0];

    // Open dialog
    await modalController.openDialog();
    await waitDialogLoaded(getByRole);

    // Go to favorites
    await activateTab('Favorites', renderResult);
    await waitFor(() => expect(queryByText(pathGroup.name)).toBeInTheDocument());

    // Open the group
    clickButton(pathGroup.name, getByRole);

    // Download path
    const downloadPath = pathGroup.paths[0];
    await waitFor(() => expect(getByRole('button', { name: downloadPath })).toBeTruthy());

    await modalController.closeDialogText(downloadPath);

    await waitFor(() => expect(onSaveHistory).toHaveBeenCalled());

    // Check
    expectDownloadHandlerToMatchSnapshot(handleDownload);
  });

  test('should open and close download dialog', async () => {
    const { modalController, getByText, queryByText, getByRole } = await renderDialog();

    // Open download file browser
    await modalController.openDialog();
    await waitDialogLoaded(getByRole);

    expect(fireEvent.click(getByText('Browse'))).toBeTruthy();

    // Open browse dialog
    await waitForData(/Loading items/i, queryByText);

    // Close it
    await modalController.closeDialogButton('Cancel');
  });

  describe('selection download', () => {
    const SELECTED_IDS = ['101', '102', '103'];

    const renderSelectionDialog = () =>
      renderDialog(`/home/download/${DOWNLOAD_SELECTION_ID}`, {
        downloadItemIds: SELECTED_IDS,
      });

    test('should queue every selected item', async () => {
      const { onSaveHistory, modalController, handleDownload, getByRole, queryByText } =
        await renderSelectionDialog();

      const downloadPath = HistoryStringPathResponse[0];

      await modalController.openDialog();

      await waitFor(() => expect(queryByText(downloadPath)).toBeInTheDocument());
      await waitDialogLoaded(getByRole);

      await modalController.closeDialogText(downloadPath);

      await waitFor(() => expect(onSaveHistory).toHaveBeenCalled());

      // One download per selected item, each keeping its own target name
      expect(handleDownload).toHaveBeenCalledTimes(SELECTED_IDS.length);

      const queuedNames = handleDownload.mock.calls.map(
        (call) => call[1].target_name,
      );
      expect(queuedNames).toEqual(
        SELECTED_IDS.map((id) => `${FilelistGetFilelistItemFileResponse.name}-${id}`),
      );

      // All queued into the chosen directory
      handleDownload.mock.calls.forEach((call) => {
        expect(call[1].target_directory).toBe(downloadPath);
      });
    });

    test('should show the selected item count as the dialog subtitle', async () => {
      const { modalController, getByRole, queryByText } = await renderSelectionDialog();

      await modalController.openDialog();
      await waitDialogLoaded(getByRole);

      await waitFor(() =>
        expect(queryByText(`${SELECTED_IDS.length} items`)).toBeInTheDocument(),
      );
    });

    test('should report when the selection is missing', async () => {
      // Reached by opening the route directly, with no selection in the state
      const { modalController, queryByText } = await renderDialog(
        `/home/download/${DOWNLOAD_SELECTION_ID}`,
      );

      await modalController.openDialog();

      await waitFor(() =>
        expect(queryByText('No items were selected for downloading')).toBeInTheDocument(),
      );
    });
  });

  test('should handle browse dialog download', async () => {
    const {
      onSaveHistory,
      modalController,
      handleDownload,
      getByText,
      queryByText,
      getByRole,
    } = await renderDialog();

    // Open download file browser
    await modalController.openDialog();
    await waitDialogLoaded(getByRole);

    expect(fireEvent.click(getByText('Browse'))).toBeTruthy();

    // Open browse dialog
    await waitForData('Loading items', queryByText);

    // Download
    await modalController.closeDialogButton('Download');

    expectDownloadHandlerToMatchSnapshot(handleDownload);

    await waitFor(() => expect(onSaveHistory).toHaveBeenCalled());
  });
});
