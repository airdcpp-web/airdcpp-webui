import {
  getConnectedSocket,
  getMockServer,
} from 'airdcpp-apisocket/tests/mock-server.js';

import { jest } from '@jest/globals';
import ShareConstants from 'constants/ShareConstants';
import { ShareGetGroupedRootsResponse } from 'tests/mocks/api/share';
import FavoriteDirectoryConstants from 'constants/FavoriteDirectoryConstants';
import { FavoriteDirectoriesGroupedPathsResponse } from 'tests/mocks/api/favorite-directories';
import HistoryConstants, { HistoryStringEnum } from 'constants/HistoryConstants';
import {
  FilelistGetFilelistItemFileResponse,
  FilelistGetResponse,
  MOCK_FILELIST_ITEM_ID,
} from 'tests/mocks/api/filelist';
import FilesystemConstants from 'constants/FilesystemConstants';
import {
  FilesystemDiskInfoResponse,
  FilesystemListContentResponse,
} from 'tests/mocks/api/filesystem';
import { renderRoutes } from 'tests/test-containers';
import DownloadDialog from '../DownloadDialog';

import * as UI from 'types/ui';
import * as API from 'types/api';
import { MockHintedUserResponse } from 'tests/mocks/api/user';
import {
  act,
  waitForElementToBeRemoved,
  waitFor,
  fireEvent,
} from '@testing-library/react';

// import preview from 'jest-preview';
import { HistoryStringPathResponse } from 'tests/mocks/api/history';
import {
  createTestModalController,
  TestModalNavigateButton,
  waitForData,
} from 'tests/test-component-helpers';

// tslint:disable:no-empty
describe('DownloadDialog', () => {
  let server: ReturnType<typeof getMockServer>;
  const getSocket = async () => {
    const { socket } = await getConnectedSocket(server);

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

    return socket;
  };

  const renderDialog = async () => {
    const socket = await getSocket();
    const handleDownload = jest.fn<UI.DownloadHandler<API.FilelistItem>>();

    const DownloadDialogTest = () => {
      return (
        <>
          <TestModalNavigateButton
            modalRoute={`/home/download/${MOCK_FILELIST_ITEM_ID}`}
          />
          <DownloadDialog
            downloadHandler={handleDownload}
            itemDataGetter={() =>
              Promise.resolve(FilelistGetFilelistItemFileResponse as API.FilelistItem)
            }
            userGetter={() => MockHintedUserResponse as API.HintedUser}
            session={FilelistGetResponse}
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

    const renderData = await renderRoutes(routes, {
      socket,
      routerProps: { initialEntries: ['/home'] },
    });

    const modalController = createTestModalController(renderData);
    return { socket, handleDownload, modalController, ...renderData };
  };

  beforeEach(() => {
    server = getMockServer();
  });

  afterEach(() => {
    server.stop();
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
    expect(handleDownload).toHaveBeenCalledTimes(1);
    expect(handleDownload.mock.calls).toMatchSnapshot();

    socket.disconnect();
  });

  test('should open and close download dialog', async () => {
    const { socket, modalController, getByText, queryByText } = await renderDialog();

    // Open download file browser
    await modalController.openDialog();
    expect(fireEvent.click(getByText('Browse'))).toBeTruthy();

    // Open browse dialog
    await waitFor(() => queryByText(/Loading items/i));
    await waitForElementToBeRemoved(() => queryByText(/Loading items/i));

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

    expect(handleDownload).toHaveBeenCalledTimes(1);
    expect(handleDownload.mock.calls).toMatchSnapshot();

    socket.disconnect();
  });
});
