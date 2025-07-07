import { getConnectedSocket, getMockServer } from 'airdcpp-apisocket/tests';

import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';

import { renderDataRoutes } from '@/tests/render/test-renderers';

import * as UI from '@/types/ui';

import {
  createTestRouteModalController,
  TestRouteModalNavigateButton,
} from '@/tests/helpers/test-dialog-helpers';
import { getModuleT } from '@/utils/TranslationUtils';
import { useTranslation } from 'react-i18next';
import ShareProfileConstants from '@/constants/ShareProfileConstants';
import {
  ShareProfileDefault,
  ShareProfileEmpty,
  ShareProfilesListResponse,
} from '@/tests/mocks/api/share-profiles';

import {
  expectFieldValue,
  setInputFieldValues,
  addSelectFieldValues,
  setupUserEvent,
  setSelectFieldValues,
} from '@/tests/helpers/test-form-helpers';
import ShareRootConstants from '@/constants/ShareRootConstants';
import { MOCK_SHARE_ROOT_ID, ShareRootGetResponse } from '@/tests/mocks/api/share-roots';
import ShareDirectoryDialog from '../components/ShareDirectoryDialog';
import ShareConstants from '@/constants/ShareConstants';
import { ShareGetGroupedRootsResponse } from '@/tests/mocks/api/share';
import { fireEvent, waitFor } from '@testing-library/dom';
import FilesystemConstants from '@/constants/FilesystemConstants';
import { FilesystemListContentResponse } from '@/tests/mocks/api/filesystem';
import { getBrowseStorageKey } from '@/components/filebrowser/effects/useFileItemSelection';
import { saveLocalProperty } from '@/utils/BrowserUtils';
import { formatProfileNameWithSize } from '@/utils/ShareProfileUtils';
import { clickButton, waitForData } from '@/tests/helpers/test-helpers';

// tslint:disable:no-empty
describe('ShareDirectoryDialog', () => {
  let server: ReturnType<typeof getMockServer>;
  const getSocket = async () => {
    const { socket } = await getConnectedSocket(server);

    // Data fetch
    server.addRequestHandler(
      'GET',
      ShareProfileConstants.PROFILES_URL,
      ShareProfilesListResponse,
    );
    server.addRequestHandler(
      'GET',
      `${ShareRootConstants.ROOTS_URL}/${MOCK_SHARE_ROOT_ID}`,
      ShareRootGetResponse,
    );
    server.addRequestHandler(
      'GET',
      ShareConstants.GROUPED_ROOTS_GET_URL,
      ShareGetGroupedRootsResponse,
    );

    // Browse dialog
    server.addRequestHandler(
      'POST',
      FilesystemConstants.LIST_URL,
      FilesystemListContentResponse,
    );

    // Listeners
    server.addSubscriptionHandler(
      ShareProfileConstants.PROFILES_URL,
      'share_profile_added',
      undefined,
    );
    server.addSubscriptionHandler(
      ShareProfileConstants.PROFILES_URL,
      'share_profile_updated',
      undefined,
    );
    server.addSubscriptionHandler(
      ShareProfileConstants.PROFILES_URL,
      'share_profile_removed',
      undefined,
    );

    const onCreated = vi.fn();
    const onUpdated = vi.fn();

    // Save handlers
    server.addRequestHandler(
      'PATCH',
      `${ShareRootConstants.ROOTS_URL}/${MOCK_SHARE_ROOT_ID}`,
      undefined,
      onUpdated,
    );
    server.addRequestHandler('POST', ShareRootConstants.ROOTS_URL, undefined, onCreated);

    return { socket, server, onCreated, onUpdated };
  };

  const renderDialog = async (id: number | string | null) => {
    const { socket, server, ...other } = await getSocket();

    const ShareDirectoryDialogTest = () => {
      const { t } = useTranslation();
      const shareT = getModuleT(t, UI.Modules.SHARE);
      return (
        <>
          <TestRouteModalNavigateButton
            modalRoute={id ? `/home/directories/${id}` : '/home/directories'}
          />
          <ShareDirectoryDialog shareT={shareT} />
        </>
      );
    };

    const routes = [
      {
        path: '/home/*',
        Component: ShareDirectoryDialogTest,
      },
    ];

    const renderData = renderDataRoutes(routes, {
      socket,
      routerProps: { initialEntries: ['/home'] },
    });

    const modalController = createTestRouteModalController(renderData);
    return { modalController, ...renderData, ...other };
  };

  const ShareProfileField = {
    id: 'profiles',
    label: 'Share profiles',
  };

  beforeEach(() => {
    server = getMockServer();
  });

  afterEach(() => {
    server.stop();
    localStorage.clear();
  });

  test('should update existing', async () => {
    const userEvent = setupUserEvent();
    const {
      getByText,
      getByLabelText,
      getByRole,
      modalController,
      onUpdated,
      formatter,
    } = await renderDialog(MOCK_SHARE_ROOT_ID);

    await modalController.openDialog();

    // Check content
    await waitFor(() => expect(getByText('Edit share directory')).toBeTruthy());

    // Edit
    await setInputFieldValues(
      { userEvent, getByLabelText },
      {
        'Virtual name': 'Updated name',
      },
    );

    await setSelectFieldValues(
      { getByLabelText, getByRole },
      {
        field: ShareProfileField,
        options: [
          {
            id: ShareProfileEmpty.id.toString(),
            label: formatProfileNameWithSize(ShareProfileEmpty, formatter),
          },
        ],
      },
    );

    await modalController.closeDialogButton('Save');

    expect(onUpdated).toHaveBeenCalledTimes(1);
    expect(onUpdated.mock.calls[0]).toMatchSnapshot();
  }, 100000);

  test('should create new', async () => {
    const {
      getByText,
      getByLabelText,
      modalController,
      getByRole,
      onCreated,
      formatter,
      queryByText,
    } = await renderDialog(null);

    await modalController.openDialog();

    // Check content
    await waitFor(() => expect(getByText('Add share directory')).toBeTruthy());

    // Edit

    // Path

    // Set the initial browse dialog path
    const path = '/home/airdcpp/Downloads/';
    saveLocalProperty(getBrowseStorageKey(FilesystemConstants.LOCATION_DOWNLOAD), path);

    // Open dialog and select the initial path
    expect(fireEvent.click(getByText('Browse'))).toBeTruthy();
    await waitForData('Loading items', queryByText);

    clickButton('Select', getByRole);

    await waitFor(() => {
      expectFieldValue({ getByLabelText }, 'Path', path);
    });

    // Virtual name should be set based on the path
    await waitFor(() => {
      expectFieldValue({ getByLabelText }, 'Virtual name', 'Downloads');
    });

    // Profiles
    await addSelectFieldValues(
      { getByLabelText, getByRole },
      {
        field: ShareProfileField,
        options: [
          {
            id: ShareProfileEmpty.id.toString(),
            label: formatProfileNameWithSize(ShareProfileEmpty, formatter),
          },
          {
            id: ShareProfileDefault.id.toString(),
            label: formatProfileNameWithSize(ShareProfileDefault, formatter),
          },
        ],
      },
    );

    await modalController.closeDialogButton('Save');

    expect(onCreated).toHaveBeenCalledTimes(1);
    expect(onCreated.mock.calls[0]).toMatchSnapshot();
  }, 100000);
});
