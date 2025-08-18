import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { useTranslation } from 'react-i18next';
import { waitFor } from '@testing-library/dom';

import { renderDataRoutes } from '@/tests/render/test-renderers';

import * as UI from '@/types/ui';

import {
  createTestRouteModalController,
  TestRouteModalNavigateButton,
} from '@/tests/helpers/test-dialog-helpers';
import FavoriteHubDialog from '../components/FavoriteHubDialog';
import { getModuleT } from '@/utils/TranslationUtils';
import ShareProfileConstants from '@/constants/ShareProfileConstants';
import { ShareProfilesListResponse } from '@/tests/mocks/api/share-profiles';
import FavoriteHubConstants from '@/constants/FavoriteHubConstants';
import {
  MOCK_FAVORITE_HUB_ID,
  FavoriteHubAdcDisconnectedResponse,
} from '@/tests/mocks/api/favorite-hubs';
import { setInputFieldValues, setupUserEvent } from '@/tests/helpers/test-form-helpers';
import { initCommonDataMocks } from '@/tests/mocks/mock-data-common';
import { waitExpectRequestToMatchSnapshot } from '@/tests/helpers/test-helpers';
import { getMockServer, MockServer } from '@/tests/mocks/mock-server';
import { VIEW_FIXED_HEIGHT } from '@/tests/render/test-containers';

// tslint:disable:no-empty
describe('FavoriteHubDialog', () => {
  let server: MockServer;

  beforeEach(() => {
    server = getMockServer();
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
      `${FavoriteHubConstants.HUBS_URL}/${MOCK_FAVORITE_HUB_ID}`,
      FavoriteHubAdcDisconnectedResponse,
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
      `${FavoriteHubConstants.HUBS_URL}/${MOCK_FAVORITE_HUB_ID}`,
      undefined,
      onUpdated,
    );
    server.addRequestHandler('POST', FavoriteHubConstants.HUBS_URL, undefined, onCreated);

    return { commonData, server, onCreated, onUpdated };
  };

  const renderDialog = async (id: number | null) => {
    const { commonData, server, ...other } = await getSocket();

    const FavoriteHubDialogTest = () => {
      const { t } = useTranslation();
      const favT = getModuleT(t, UI.Modules.FAVORITE_HUBS);
      return (
        <>
          <TestRouteModalNavigateButton
            modalRoute={id ? `/home/entries/${id}` : '/home/entries'}
          />
          <FavoriteHubDialog favT={favT} />
        </>
      );
    };

    const routes = [
      {
        path: '/home/*',
        Component: FavoriteHubDialogTest,
      },
    ];

    const renderData = renderDataRoutes(routes, commonData, {
      routerProps: { initialEntries: ['/home'] },
      viewType: VIEW_FIXED_HEIGHT,
    });

    const modalController = createTestRouteModalController(renderData);
    return { modalController, ...commonData, ...renderData, ...other };
  };

  test('should update existing', async () => {
    const userEvent = setupUserEvent();
    const { getByText, getByLabelText, modalController, onUpdated } =
      await renderDialog(MOCK_FAVORITE_HUB_ID);

    await modalController.openDialog();

    // Check content
    await waitFor(() => expect(getByText('Edit favorite hub')).toBeTruthy());

    // Edit
    await setInputFieldValues(
      { userEvent, getByLabelText },
      {
        Name: 'Updated name',
      },
    );

    await modalController.closeDialogButton('Save');

    await waitExpectRequestToMatchSnapshot(onUpdated);
  });

  test('should create new', async () => {
    const userEvent = setupUserEvent();
    const { getByText, getByLabelText, modalController, onCreated } =
      await renderDialog(null);

    await modalController.openDialog();

    // Check content
    await waitFor(() => expect(getByText('Add favorite hub')).toBeTruthy());

    // Edit
    await setInputFieldValues(
      { userEvent, getByLabelText },
      {
        Name: 'Hub name',
        'Hub URL': 'adcs://example.com:1511 ',
      },
    );

    await modalController.closeDialogButton('Save');

    await waitExpectRequestToMatchSnapshot(onCreated);
  });
});
