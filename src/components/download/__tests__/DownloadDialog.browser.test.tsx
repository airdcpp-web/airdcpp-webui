import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { waitFor, fireEvent } from '@testing-library/react';

import { getMockServer } from 'airdcpp-apisocket/tests';

import ShareConstants from '@/constants/ShareConstants';
import { ShareGetGroupedRootsResponse } from '@/tests/mocks/api/share';
import FavoriteDirectoryConstants from '@/constants/FavoriteDirectoryConstants';
import { FavoriteDirectoriesGroupedPathsResponse } from '@/tests/mocks/api/favorite-directories';
import HistoryConstants, { HistoryStringEnum } from '@/constants/HistoryConstants';
import {
  FilelistGetFilelistItemFileResponse,
  FilelistGetResponse,
  MOCK_FILELIST_ITEM_ID,
} from '@/tests/mocks/api/filelist';
import FilesystemConstants from '@/constants/FilesystemConstants';
import {
  FilesystemDiskInfoResponse,
  FilesystemListContentResponse,
} from '@/tests/mocks/api/filesystem';
import { renderDataRoutes } from '@/tests/render/test-renderers';
import DownloadDialog from '../DownloadDialog';

import * as UI from '@/types/ui';
import * as API from '@/types/api';

import { MockHintedUser1Response } from '@/tests/mocks/api/user';

import { HistoryStringPathResponse } from '@/tests/mocks/api/history';
import {
  createTestRouteModalController,
  TestRouteModalNavigateButton,
} from '@/tests/helpers/test-dialog-helpers';
import { waitForData } from '@/tests/helpers/test-helpers';
import { initCommonDataMocks } from '@/tests/mocks/mock-data-common';

// tslint:disable:no-empty
describe('DownloadDialog', () => {
  let server: ReturnType<typeof getMockServer>;
  const getSocket = async () => {
    const commonData = await initCommonDataMocks(server);

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
    );

    // File browser
    server.addRequestHandler(
      'POST',
      FilesystemConstants.DISK_INFO_URL,
      FilesystemDiskInfoResponse,
    );
    server.addRequestHandler(
      'POST',
      FilesystemConstants.LIST_URL,
      FilesystemListContentResponse,
    );

    return commonData;
  };

  const renderDialog = async () => {
    const commonData = await getSocket();
    const handleDownload = vi.fn<UI.DownloadHandler<API.FilelistItem>>();

    const DownloadDialogTest = () => {
      return (
        <>
          <TestRouteModalNavigateButton
            modalRoute={`/home/download/${MOCK_FILELIST_ITEM_ID}`}
          />
          <DownloadDialog
            downloadHandler={handleDownload}
            itemDataGetter={() =>
              Promise.resolve(FilelistGetFilelistItemFileResponse as API.FilelistItem)
            }
            userGetter={() => MockHintedUser1Response as API.HintedUser}
            sessionItem={FilelistGetResponse}
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

  beforeEach(() => {
    server = getMockServer();
  });

  afterEach(() => {
    server.stop();
    localStorage.clear();
  });

  test('should load and close', async () => {
    const { getByText, socket, modalController } = await renderDialog();

    await modalController.openDialog();

    // Check content
    await waitFor(() => expect(getByText('Download')).toBeTruthy());

    await modalController.closeDialogButton('Close');

    socket.disconnect();
  });

  test('should handle download', async () => {
    const { socket, modalController, handleDownload } = await renderDialog();

    await modalController.openDialog();

    // Download
    await modalController.closeDialogText(HistoryStringPathResponse[0]);

    // Check
    expectDownloadHandlerToMatchSnapshot(handleDownload);

    socket.disconnect();
  });

  test('should open and close download dialog', async () => {
    const { socket, modalController, getByText, queryByText } = await renderDialog();

    // Open download file browser
    await modalController.openDialog();
    expect(fireEvent.click(getByText('Browse'))).toBeTruthy();

    // Open browse dialog
    await waitForData(/Loading items/i, queryByText);

    // Close it
    await modalController.closeDialogButton('Cancel');

    socket.disconnect();
  });

  test('should handle browse dialog download', async () => {
    const { socket, modalController, handleDownload, getByText, queryByText } =
      await renderDialog();

    // Open download file browser
    await modalController.openDialog();
    expect(fireEvent.click(getByText('Browse'))).toBeTruthy();

    // Open browse dialog
    await waitForData('Loading items', queryByText);

    // Download
    await modalController.closeDialogButton('Download');

    expectDownloadHandlerToMatchSnapshot(handleDownload);

    socket.disconnect();
  });
});
