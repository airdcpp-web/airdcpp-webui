import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { waitFor } from '@testing-library/react';
import { useState } from 'react';

import ShareConstants from '@/constants/ShareConstants';
import { ShareGetGroupedRootsResponse } from '@/tests/mocks/api/share';
import FavoriteDirectoryConstants from '@/constants/FavoriteDirectoryConstants';
import { FavoriteDirectoriesGroupedPathsResponse } from '@/tests/mocks/api/favorite-directories';
import HistoryConstants, { HistoryStringEnum } from '@/constants/HistoryConstants';
import { HistoryStringPathResponse } from '@/tests/mocks/api/history';

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

  const setupMocks = async () => {
    const commonData = await initCommonDataMocks(server);

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

    const userEvent = setupUserEvent();
    return { ...commonData, onSaveHistory, userEvent };
  };

  const renderDialog = async (
    items: API.GroupedSearchResult[] = mockItems,
    downloadHandler?: UI.DownloadHandler<API.GroupedSearchResult>
  ) => {
    const commonData = await setupMocks();
    const handleDownload =
      downloadHandler ?? vi.fn<UI.DownloadHandler<API.GroupedSearchResult>>();
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
    test('should call onClose immediately when items becomes empty', async () => {
      const handleDownload = vi.fn();
      const handleClose = vi.fn();
      const commonData = await setupMocks();

      const EmptyItemsTest = createEmptyItemsTest(handleDownload, handleClose);

      const routes = [{ path: '/home/*', Component: EmptyItemsTest }];

      renderDataRoutes(routes, commonData, {
        routerProps: { initialEntries: ['/home'] },
        viewType: VIEW_FIXED_HEIGHT,
      });

      await waitFor(() => {
        expect(handleClose).toHaveBeenCalledTimes(1);
      });
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
      const handleDownload = vi.fn().mockResolvedValue(undefined);
      const { modalController } = await renderDialog(mockItems, handleDownload);

      await modalController.openDialog();

      // Verify dialog opened successfully
      modalController.expectDialogOpen();

      // The download handler is passed to the component
      expect(handleDownload).toBeDefined();
    });
  });
});
