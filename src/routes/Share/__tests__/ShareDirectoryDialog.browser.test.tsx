import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';

import { BaseRenderResult, renderDataRoutes } from '@/tests/render/test-renderers';

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
  setupUserEvent,
  setSelectFieldValues,
} from '@/tests/helpers/test-form-helpers';
import ShareRootConstants from '@/constants/ShareRootConstants';
import { MOCK_SHARE_ROOT_ID, ShareRootNormal } from '@/tests/mocks/api/share-roots';
import ShareDirectoryDialog from '../components/ShareDirectoryDialog';
import ShareConstants from '@/constants/ShareConstants';
import { ShareGetGroupedRootsResponse } from '@/tests/mocks/api/share';
import { fireEvent, waitFor } from '@testing-library/dom';
import FilesystemConstants from '@/constants/FilesystemConstants';
import { FilesystemListContentResponse } from '@/tests/mocks/api/filesystem';
import { getBrowseStorageKey } from '@/components/filebrowser/effects/useFileItemSelection';
import { saveLocalProperty } from '@/utils/BrowserUtils';
import { formatProfileNameWithSize } from '@/utils/ShareProfileUtils';
import {
  clickButton,
  waitExpectRequestToMatchSnapshot,
  waitForData,
} from '@/tests/helpers/test-helpers';
import { initCommonDataMocks } from '@/tests/mocks/mock-data-common';
import { getMockServer, MockServer } from '@/tests/mocks/mock-server';
import { VIEW_FIXED_HEIGHT } from '@/tests/render/test-containers';

import * as API from '@/types/api';

// tslint:disable:no-empty
describe('ShareDirectoryDialog', () => {
  let server: MockServer;

  beforeEach(() => {
    server =
      getMockServer(/*{
      delayMs: 0,
      loggerOptions: {
        logLevel: 'verbose',
      },
    }*/);
  });

  afterEach(() => {
    server.stop();
  });

  const getSocket = async () => {
    const commonData = await initCommonDataMocks(server);

    // Data fetch
    server.addRequestHandler(
      'GET',
      ShareProfileConstants.PROFILES_URL,
      ShareProfilesListResponse,
    );
    server.addRequestHandler(
      'GET',
      `${ShareRootConstants.ROOTS_URL}/${MOCK_SHARE_ROOT_ID}`,
      ShareRootNormal,
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

    return { commonData, server, onCreated, onUpdated };
  };

  const renderDialog = async (id: number | string | null) => {
    const { commonData, server, ...other } = await getSocket();

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

    const renderData = renderDataRoutes(routes, commonData, {
      routerProps: { initialEntries: ['/home'] },
      viewType: VIEW_FIXED_HEIGHT,
    });

    const modalController = createTestRouteModalController(renderData);
    return { modalController, ...commonData, ...renderData, ...other };
  };

  const setProfiles = async (
    {
      getByLabelText,
      getByRole,
      formatter,
    }: Pick<BaseRenderResult, 'getByLabelText' | 'getByRole' | 'formatter'>,
    profiles: API.ShareProfile[],
  ) => {
    await setSelectFieldValues(
      { getByLabelText, getByRole },
      {
        field: ShareProfileField,
        options: profiles.map((p) => ({
          id: p.id.toString(),
          label: formatProfileNameWithSize(p, formatter),
        })),
      },
    );
  };

  const setPath = async (
    { getByText, getByLabelText, getByRole, queryByText }: BaseRenderResult,
    path: string,
  ) => {
    saveLocalProperty(getBrowseStorageKey(FilesystemConstants.LOCATION_DOWNLOAD), path);

    // Open dialog and select the initial path
    expect(fireEvent.click(getByText('Browse'))).toBeTruthy();
    await waitForData('Loading items', queryByText);

    clickButton('Select', getByRole);

    await waitFor(() => {
      expectFieldValue({ getByLabelText }, 'Path', path);
    });
  };

  const ShareProfileField = {
    id: 'profiles',
    label: 'Share profiles',
  };

  test('should update existing', async () => {
    const userEvent = setupUserEvent();
    const renderResult = await renderDialog(MOCK_SHARE_ROOT_ID);
    const { getByText, getByLabelText, modalController, onUpdated } = renderResult;

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

    await setProfiles(renderResult, [ShareProfileEmpty]);

    await modalController.closeDialogButton('Save');

    await waitExpectRequestToMatchSnapshot(onUpdated);
  }, 100000);

  test('should create new', async () => {
    const renderResult = await renderDialog(null);
    const { getByText, getByLabelText, modalController, onCreated } = renderResult;

    await modalController.openDialog();

    // Check content
    await waitFor(() => expect(getByText('Add share directory')).toBeTruthy());

    // Edit

    // Profiles
    await setProfiles(renderResult, [ShareProfileDefault, ShareProfileEmpty]);

    // Path
    await setPath(renderResult, '/home/airdcpp/Downloads/');

    // Virtual name should be set based on the path
    await waitFor(() => {
      expectFieldValue({ getByLabelText }, 'Virtual name', 'Downloads');
    });

    await modalController.closeDialogButton('Save');

    await waitExpectRequestToMatchSnapshot(onCreated);
  }, 100000);
});
