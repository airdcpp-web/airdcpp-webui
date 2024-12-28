import {
  getConnectedSocket,
  getMockServer,
  waitForExpect,
} from 'airdcpp-apisocket/tests/helpers.js';

import { jest } from '@jest/globals';
import { renderRoutes } from 'tests/test-containers';

import * as UI from 'types/ui';

import {
  createTestModalController,
  TestModalNavigateButton,
} from 'tests/test-component-helpers';
import FavoriteHubDialog from '../components/FavoriteHubDialog';
import { getModuleT } from 'utils/TranslationUtils';
import { useTranslation } from 'react-i18next';
import ShareProfileConstants from 'constants/ShareProfileConstants';
import { ShareProfilesListResponse } from 'tests/mocks/api/share-profiles';
import FavoriteHubConstants from 'constants/FavoriteHubConstants';
import {
  MOCK_FAVORITE_HUB_ID,
  FavoriteHubGetResponse,
} from 'tests/mocks/api/favorite-hubs';
import { setInputFieldValues, setupUserEvent } from 'tests/test-form-helpers';

// tslint:disable:no-empty
describe('FavoriteHubDialog', () => {
  let server: ReturnType<typeof getMockServer>;
  const getSocket = async () => {
    const { socket } = await getConnectedSocket(server);

    // Data fetch
    server.addDataHandler(
      'GET',
      ShareProfileConstants.PROFILES_URL,
      ShareProfilesListResponse,
    );
    server.addDataHandler(
      'GET',
      `${FavoriteHubConstants.HUBS_URL}/${MOCK_FAVORITE_HUB_ID}`,
      FavoriteHubGetResponse,
    );

    // Listeners
    server.addDataHandler(
      'POST',
      `${ShareProfileConstants.PROFILES_URL}/listeners/share_profile_added`,
      undefined,
    );
    server.addDataHandler(
      'POST',
      `${ShareProfileConstants.PROFILES_URL}/listeners/share_profile_updated`,
      undefined,
    );
    server.addDataHandler(
      'POST',
      `${ShareProfileConstants.PROFILES_URL}/listeners/share_profile_removed`,
      undefined,
    );

    const onCreated = jest.fn();
    const onUpdated = jest.fn();

    // Save handlers
    server.addDataHandler(
      'PATCH',
      `${FavoriteHubConstants.HUBS_URL}/${MOCK_FAVORITE_HUB_ID}`,
      undefined,
      onUpdated,
    );
    server.addDataHandler('POST', FavoriteHubConstants.HUBS_URL, undefined, onCreated);

    return { socket, server, onCreated, onUpdated };
  };

  const renderDialog = async (id: number | null) => {
    const { socket, server, ...other } = await getSocket();

    const FavoriteHubDialogTest = () => {
      const { t } = useTranslation();
      const favT = getModuleT(t, UI.Modules.FAVORITE_HUBS);
      return (
        <>
          <TestModalNavigateButton
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

    const renderData = await renderRoutes(routes, {
      socket,
      routerProps: { initialEntries: ['/home'] },
    });

    const modalController = createTestModalController(renderData);
    return { modalController, ...renderData, ...other };
  };

  beforeEach(() => {
    server = getMockServer();
  });

  afterEach(() => {
    server.stop();
  });

  test('should update existing', async () => {
    const userEvent = setupUserEvent();
    const { getByText, getByLabelText, modalController, onUpdated } =
      await renderDialog(MOCK_FAVORITE_HUB_ID);

    await modalController.openDialog();

    // Check content
    await waitForExpect(() => expect(getByText('Edit favorite hub')).toBeTruthy());

    // Edit
    await setInputFieldValues(
      { userEvent, getByLabelText },
      {
        Name: 'Updated name',
      },
    );

    await modalController.closeDialogButton('Save');

    expect(onUpdated).toHaveBeenCalledTimes(1);
    expect(onUpdated.mock.calls[0]).toMatchSnapshot();
  }, 100000);

  test('should create new', async () => {
    const userEvent = setupUserEvent();
    const { getByText, getByLabelText, modalController, onCreated, onUpdated } =
      await renderDialog(null);

    await modalController.openDialog();

    // Check content
    await waitForExpect(() => expect(getByText('Add favorite hub')).toBeTruthy());

    // Edit
    await setInputFieldValues(
      { userEvent, getByLabelText },
      {
        Name: 'Hub name',
        'Hub URL': 'adcs://example.com:1511 ',
      },
    );

    await modalController.closeDialogButton('Save');

    expect(onCreated).toHaveBeenCalledTimes(1);
    expect(onCreated.mock.calls[0]).toMatchSnapshot();

    // stop();
  }, 100000);
});
