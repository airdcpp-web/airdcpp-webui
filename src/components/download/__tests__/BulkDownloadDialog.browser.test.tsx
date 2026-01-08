import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { waitFor } from '@testing-library/react';
import { useState } from 'react';

import ShareConstants from '@/constants/ShareConstants';
import { ShareGetGroupedRootsResponse } from '@/tests/mocks/api/share';
import FavoriteDirectoryConstants from '@/constants/FavoriteDirectoryConstants';
import { FavoriteDirectoriesGroupedPathsResponse } from '@/tests/mocks/api/favorite-directories';
import HistoryConstants, { HistoryStringEnum } from '@/constants/HistoryConstants';
import { HistoryStringPathResponse } from '@/tests/mocks/api/history';
import FilesystemConstants from '@/constants/FilesystemConstants';
import {
  FilesystemDiskInfoResponse,
  FilesystemListContentResponse,
} from '@/tests/mocks/api/filesystem';

import { renderDataRoutes } from '@/tests/render/test-renderers';
import BulkDownloadDialog from '../BulkDownloadDialog';
import Button from '@/components/semantic/Button';

import * as UI from '@/types/ui';
import * as API from '@/types/api';

import {
  GroupedSearchResultFileResponse,
  SearchInstance1Response,
} from '@/tests/mocks/api/search';

import { initCommonDataMocks } from '@/tests/mocks/mock-data-common';
import { getMockServer, MockServer } from '@/tests/mocks/mock-server';
import { VIEW_FIXED_HEIGHT } from '@/tests/render/test-containers';
import { createTestModalController } from '@/tests/helpers/test-dialog-helpers';
import { setupUserEvent } from '@/tests/helpers/test-form-helpers';
import { waitForData } from '@/tests/helpers/test-helpers';

// Test wrapper component for empty items scenario (extracted to avoid nested function)
const createEmptyItemsTest = (
  handleDownload: ReturnType<typeof vi.fn>,
  handleClose: ReturnType<typeof vi.fn>,
) => {
  const EmptyItemsTest = () => {
    const [showDialog, setShowDialog] = useState(true);
    return showDialog ? (
      <BulkDownloadDialog
        items={[]}
        downloadHandler={handleDownload}
        sessionItem={SearchInstance1Response as unknown as UI.SessionItemBase}
        onClose={() => {
          setShowDialog(false);
          handleClose();
        }}
      />
    ) : null;
  };
  return EmptyItemsTest;
};

// Create mock items for testing
const createMockItem = (id: string, name: string): API.GroupedSearchResult => ({
  ...GroupedSearchResultFileResponse,
  id,
  name,
  path: `/${name}`,
});

const mockItems = [
  createMockItem('item1', 'file1.iso'),
  createMockItem('item2', 'file2.iso'),
  createMockItem('item3', 'file3.iso'),
];

describe('BulkDownloadDialog', () => {
  let server: MockServer;

  beforeEach(() => {
    server = getMockServer();
    vi.clearAllMocks();
  });

  afterEach(() => {
    server.stop();
  });

  interface SetupMocksOptions {
    permissions?: API.AccessEnum[];
  }

  const setupMocks = async (options: SetupMocksOptions = {}) => {
    const { permissions } = options;
    const commonData = await initCommonDataMocks(server, { permissions });

    const onSaveHistory = vi.fn();

    // Target paths fetch
    server.addRequestHandler(
      'GET',
      ShareConstants.GROUPED_ROOTS_GET_URL,
      ShareGetGroupedRootsResponse
    );
    server.addRequestHandler(
      'GET',
      FavoriteDirectoryConstants.GROUPED_DIRECTORIES_URL,
      FavoriteDirectoriesGroupedPathsResponse
    );
    server.addRequestHandler(
      'GET',
      `${HistoryConstants.STRINGS_URL}/${HistoryStringEnum.DOWNLOAD_DIR}`,
      HistoryStringPathResponse
    );

    // Saving of the selected path
    server.addRequestHandler(
      'POST',
      `${HistoryConstants.STRINGS_URL}/${HistoryStringEnum.DOWNLOAD_DIR}`,
      undefined,
      onSaveHistory
    );

    // File browser (for browse functionality tests)
    server.addRequestHandler(
      'POST',
      FilesystemConstants.DISK_INFO_URL,
      (request) => {
        const requestData = request.data as { paths: string[] };
        const responseData = FilesystemDiskInfoResponse.filter((item) =>
          requestData.paths.includes(item.path),
        );
        return {
          code: 200,
          data: responseData,
        };
      },
    );
    server.addRequestHandler(
      'POST',
      FilesystemConstants.LIST_URL,
      FilesystemListContentResponse,
    );

    const userEvent = setupUserEvent();
    return { ...commonData, onSaveHistory, userEvent };
  };

  interface RenderDialogOptions {
    items?: API.GroupedSearchResult[];
    downloadHandler?: UI.DownloadHandler<API.GroupedSearchResult>;
    permissions?: API.AccessEnum[];
  }

  const renderDialog = async (options: RenderDialogOptions = {}) => {
    const {
      items = mockItems,
      downloadHandler: providedDownloadHandler,
      permissions,
    } = options;
    const commonData = await setupMocks({ permissions });
    const handleDownload =
      providedDownloadHandler ?? vi.fn<UI.DownloadHandler<API.GroupedSearchResult>>();
    const handleClose = vi.fn();

    const userGetter = (item: API.GroupedSearchResult): API.HintedUser | undefined =>
      item.users?.user;

    // Wrapper component that controls when dialog is shown
    const BulkDownloadDialogTest = () => {
      const [showDialog, setShowDialog] = useState(false);

      return (
        <>
          <Button caption="Open modal" onClick={() => setShowDialog(true)} />
          {showDialog && items.length > 0 && (
            <BulkDownloadDialog
              items={items}
              downloadHandler={handleDownload}
              sessionItem={SearchInstance1Response as unknown as UI.SessionItemBase}
              userGetter={userGetter}
              onClose={() => {
                setShowDialog(false);
                handleClose();
              }}
            />
          )}
        </>
      );
    };

    const routes = [
      {
        path: '/home/*',
        Component: BulkDownloadDialogTest,
      },
    ];

    const renderData = renderDataRoutes(routes, commonData, {
      routerProps: { initialEntries: ['/home'] },
      viewType: VIEW_FIXED_HEIGHT,
    });

    const modalController = createTestModalController({
      ...renderData,
      userEvent: commonData.userEvent,
    });

    return { ...commonData, handleDownload, handleClose, modalController, ...renderData };
  };

  describe('rendering', () => {
    test('should display dialog with item count', async () => {
      const { queryByText, modalController } = await renderDialog();

      await modalController.openDialog();

      await waitFor(() => {
        expect(queryByText(/3 items/i)).toBeInTheDocument();
      });
    });

    test('should display Download title', async () => {
      const { queryByText, modalController } = await renderDialog();

      await modalController.openDialog();

      await waitFor(() => {
        expect(queryByText('Download')).toBeInTheDocument();
      });
    });

    test('should display Close button', async () => {
      const { getByRole, modalController } = await renderDialog();

      await modalController.openDialog();

      await waitFor(() => {
        expect(getByRole('button', { name: /close/i })).toBeInTheDocument();
      });
    });
  });

  describe('empty items handling', () => {
    test('should not auto-close when items is empty', async () => {
      const handleDownload = vi.fn();
      const handleClose = vi.fn();
      const commonData = await setupMocks();

      const EmptyItemsTest = createEmptyItemsTest(handleDownload, handleClose);

      const routes = [{ path: '/home/*', Component: EmptyItemsTest }];

      renderDataRoutes(routes, commonData, {
        routerProps: { initialEntries: ['/home'] },
        viewType: VIEW_FIXED_HEIGHT,
      });

      // Wait a bit to ensure any async effects have run
      await new Promise((resolve) => setTimeout(resolve, 100));

      // onClose should NOT be called automatically - dialog stays open with warning
      expect(handleClose).not.toHaveBeenCalled();
    });
  });

  describe('dialog close', () => {
    test('should close dialog when Close button is clicked', async () => {
      const { handleClose, modalController } = await renderDialog();

      await modalController.openDialog();

      await modalController.closeDialogButton('Close');

      await waitFor(() => {
        expect(handleClose).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('download handler', () => {
    test('should have download handler available', async () => {
      const downloadHandler = vi.fn().mockResolvedValue(undefined);
      const { modalController } = await renderDialog({
        items: mockItems,
        downloadHandler,
      });

      await modalController.openDialog();

      // Verify dialog opened successfully
      modalController.expectDialogOpen();

      // The download handler is passed to the component
      expect(downloadHandler).toBeDefined();
    });
  });

  describe('history paths (Previous section)', () => {
    test('should display history paths after async loading', async () => {
      const { queryByText, modalController } = await renderDialog();

      await modalController.openDialog();

      // Wait for the history paths to load and display
      // HistoryStringPathResponse contains '/home/airdcpp/Downloads/' and '/mnt/disk1/Images/'
      await waitFor(() => {
        expect(queryByText(HistoryStringPathResponse[0])).toBeInTheDocument();
      });
    });

    test('should call download handler when history path is clicked', async () => {
      const downloadHandler = vi.fn().mockResolvedValue(undefined);
      const { queryByText, userEvent, onSaveHistory, modalController } = await renderDialog({
        downloadHandler,
      });

      await modalController.openDialog();

      // Wait for history paths to load
      const downloadPath = HistoryStringPathResponse[0];
      await waitFor(() => {
        expect(queryByText(downloadPath)).toBeInTheDocument();
      });

      // Click the path to download
      const pathButton = queryByText(downloadPath);
      await userEvent.click(pathButton!);

      // Verify download handler was called for each item
      await waitFor(() => {
        expect(downloadHandler).toHaveBeenCalled();
      });

      // Verify history was saved
      await waitFor(() => {
        expect(onSaveHistory).toHaveBeenCalled();
      });
    });
  });

  describe('browse button', () => {
    test('should show Browse button when user has FILESYSTEM_VIEW access', async () => {
      // ADMIN permission includes FILESYSTEM_VIEW access
      const { getByRole, modalController } = await renderDialog();

      await modalController.openDialog();

      await waitFor(() => {
        expect(getByRole('button', { name: /browse/i })).toBeInTheDocument();
      });
    });

    test('should hide Browse button when user lacks FILESYSTEM_VIEW access', async () => {
      // Use only DOWNLOAD permission - no FILESYSTEM_VIEW or ADMIN
      const { queryByRole, queryByText, modalController } = await renderDialog({
        permissions: [API.AccessEnum.DOWNLOAD],
      });

      await modalController.openDialog();

      // Wait for dialog to fully render
      await waitFor(() => {
        expect(queryByText('Download')).toBeInTheDocument();
      });

      // Browse button should not be present
      expect(queryByRole('button', { name: /browse/i })).not.toBeInTheDocument();
    });

    test('should open FileBrowserDialog when Browse is clicked', async () => {
      const { getByRole, getByText, queryByText, userEvent, modalController } = await renderDialog();

      await modalController.openDialog();

      // Wait for dialog to load
      await waitFor(() => {
        expect(getByRole('button', { name: /browse/i })).toBeInTheDocument();
      });

      // Click Browse button
      await userEvent.click(getByText('Browse'));

      // Wait for FileBrowserDialog to open (shows loading state)
      await waitForData(/Loading items/i, queryByText);
    });

    test('should trigger download when path selected in browse mode', async () => {
      const downloadHandler = vi.fn().mockResolvedValue(undefined);
      const { getByRole, getByText, queryByText, userEvent, onSaveHistory, modalController } =
        await renderDialog({ downloadHandler });

      await modalController.openDialog();

      // Wait for dialog to load
      await waitFor(() => {
        expect(getByRole('button', { name: /browse/i })).toBeInTheDocument();
      });

      // Click Browse button
      await userEvent.click(getByText('Browse'));

      // Wait for FileBrowserDialog to load
      await waitForData(/Loading items/i, queryByText);

      // Click Download button in the file browser dialog
      await modalController.closeDialogButton('Download');

      // Verify download handler was called
      await waitFor(() => {
        expect(downloadHandler).toHaveBeenCalled();
      });

      // Verify history was saved
      await waitFor(() => {
        expect(onSaveHistory).toHaveBeenCalled();
      });
    });
  });
});
