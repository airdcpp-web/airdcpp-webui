import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';

import { renderDataRoutes } from '@/tests/render/test-renderers';

import { initCommonDataMocks } from '@/tests/mocks/mock-data-common';
import SettingConstants from '@/constants/SettingConstants';
import {
  clickButton,
  expectRequestToMatchSnapshot,
  waitForData,
  waitForUrl,
} from '@/tests/helpers/test-helpers';

import { waitFor } from '@testing-library/dom';
import { getMockServer, MockServer } from '@/tests/mocks/mock-server';
import Settings, { RootSettingSections } from '../components/Settings';
import { sectionToUrl } from '../components/MenuItems';
import {
  SettingUserPageDefinitionsResponse,
  SettingUserPageValuesResponse,
} from '@/tests/mocks/api/settings';
import { setInputFieldValues, setupUserEvent } from '@/tests/helpers/test-form-helpers';

import { LocalSettings } from '@/constants/LocalSettingConstants';

describe('Settings layout', () => {
  let server: MockServer;
  const getSocket = async () => {
    const commonData = await initCommonDataMocks(server);

    const onGetValues = vi.fn();
    server.addRequestHandler(
      'POST',
      SettingConstants.ITEMS_GET_URL,
      SettingUserPageValuesResponse,
      onGetValues,
    );

    server.addRequestHandler(
      'POST',
      SettingConstants.ITEMS_DEFINITIONS_URL,
      SettingUserPageDefinitionsResponse,
    );

    const onSave = vi.fn();
    server.addRequestHandler('POST', SettingConstants.ITEMS_SET_URL, undefined, onSave);

    return { commonData, server, onSave, onGetValues };
  };

  const renderLayout = async () => {
    const { commonData, server, ...other } = await getSocket();

    const SettingsLayoutTest = () => {
      return <Settings />;
    };

    const routes = [
      {
        path: '/settings/*',
        Component: SettingsLayoutTest,
      },
    ];

    const renderData = renderDataRoutes(routes, commonData, {
      routerProps: { initialEntries: ['/settings'] },
    });

    return { ...renderData, ...other, ...commonData };
  };

  beforeEach(() => {
    server = getMockServer();
  });

  afterEach(() => {
    server.stop();
  });

  test('should save remote settings', async () => {
    const renderData = await renderLayout();
    const { getByRole, router, queryByText, onSave, onGetValues } = renderData;

    // Load settings page
    await waitForUrl(
      sectionToUrl(RootSettingSections[0].menuItems[0], RootSettingSections[0]),
      router,
    );

    await waitForData('Loading data...', queryByText);
    expect(onGetValues).toBeCalledTimes(1);

    // Edit a few values
    const userEvent = setupUserEvent();
    await setInputFieldValues(
      { ...renderData, userEvent },
      {
        Nick: 'New user name',
        'E-Mail (optional)': 'email@test.com',
      },
    );

    // Save
    await clickButton('Save changes', getByRole);

    // Check that the values were saved
    await waitFor(() => expect(onSave).toBeCalled());
    expectRequestToMatchSnapshot(onSave);

    await waitFor(() => expect(onGetValues).toBeCalledTimes(2));
  });

  test('should save local settings', async () => {
    const renderData = await renderLayout();
    const { getByRole, router, getByLabelText, appStore } = renderData;

    expect(
      appStore.getState().settings.getValue(LocalSettings.NOTIFY_PM_BOT),
    ).toBeFalsy();

    // Go to notifications page
    await router.navigate('/settings/view');
    await waitForUrl('/settings/view/notifications', router);

    // Toggle a setting
    const userEvent = setupUserEvent();
    const setting = getByLabelText('Private messages (bots)');
    await userEvent.click(setting);

    // Save
    await clickButton('Save changes', getByRole);

    // Check that the setting was saved
    await waitFor(() =>
      expect(
        appStore.getState().settings.getValue(LocalSettings.NOTIFY_PM_BOT),
      ).toBeTruthy(),
    );
  });
});
