import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { renderDataRoutes } from '@/tests/render/test-renderers';

import { waitFor } from '@testing-library/dom';

import { clickButton, expectRequestToMatchSnapshot } from '@/tests/helpers/test-helpers';
import { setInputFieldValues, setupUserEvent } from '@/tests/helpers/test-form-helpers';
import { initCommonDataMocks } from '@/tests/mocks/mock-data-common';
import { getMockServer, MockServer } from '@/tests/mocks/mock-server';
import {
  RemoteMenuGrouped1,
  RemoteMenu1ItemForm,
  RemoteMenu1ItemNormal,
  RemoteMenuGrouped2,
} from '@/tests/mocks/api/menu';
import { ActionMenu } from '@/components/action-menu';
import { VIEW_FIXED_HEIGHT } from '@/tests/render/test-containers';
import {
  getTestActionMenu,
  installActionMenuMocks,
  TestItemEnableCaption,
  TestItemRemoveApproveCaption,
  TestItemRemoveCaption,
} from './test-action-menu-helpers';
import {
  clickMenuItem,
  openMenu,
  waitMenuClosed,
} from '@/tests/helpers/test-menu-helpers';

const RemoteMenuId = 'test-remote-menu-id';

const TriggerCaption = 'Open menu';
// tslint:disable:no-empty
describe('Action dropdown menu', () => {
  let server: MockServer;

  beforeEach(() => {
    server = getMockServer();
  });

  afterEach(() => {
    server.stop();
  });

  const getSocket = async () => {
    const commonData = await initCommonDataMocks(server);

    // Remote menus
    const menuMocks = installActionMenuMocks(
      RemoteMenuId,
      [RemoteMenuGrouped1, RemoteMenuGrouped2],
      server,
    );

    const userEvent = setupUserEvent();
    return { commonData, server, menuMocks, userEvent };
  };

  const renderMenu = async (useRemoteMenu = false) => {
    const { commonData, server, ...other } = await getSocket();

    const { menu, ...actionHandlers } = getTestActionMenu();

    const onSave = vi.fn(() => Promise.resolve());

    const ActionDropdownMenuTest = () => {
      const testItemData = { id: 'test', name: 'Test Item' };
      const testEntity = { id: 'test-entity', name: 'Test Entity' };
      return (
        <ActionMenu
          caption={TriggerCaption}
          label={TriggerCaption}
          button={true}
          actions={menu}
          itemData={testItemData}
          entity={testEntity}
          remoteMenuId={useRemoteMenu ? RemoteMenuId : undefined}
          remoteMenuNestingThreshold={2}
        />
      );
    };

    const routes = [
      {
        index: true,
        Component: ActionDropdownMenuTest,
      },
    ];

    const renderData = renderDataRoutes(routes, commonData, {
      routerProps: { initialEntries: ['/'] },
      viewType: VIEW_FIXED_HEIGHT,
    });

    return { onSave, ...renderData, ...other, ...actionHandlers };
  };

  describe('Local actions', () => {
    test('should select menu item', async () => {
      const renderResult = await renderMenu();
      const { onEnable } = renderResult;

      await openMenu(TriggerCaption, renderResult);
      await clickMenuItem(TestItemEnableCaption, renderResult);

      await waitFor(() => expect(onEnable).toHaveBeenCalledTimes(1));
      await waitMenuClosed(renderResult);
    }, 100000);

    test('should handle confirm data', async () => {
      const renderResult = await renderMenu();
      const { onRemove, getByText, getByRole } = renderResult;

      await openMenu(TriggerCaption, renderResult);
      await clickMenuItem(TestItemRemoveCaption, renderResult);

      await waitFor(() => expect(getByText(TestItemRemoveApproveCaption)).toBeTruthy());
      expect(onRemove).toHaveBeenCalledTimes(0);

      await clickButton(TestItemRemoveApproveCaption, getByRole);
      await waitFor(() => expect(onRemove).toHaveBeenCalledTimes(1));
      await waitMenuClosed(renderResult);
    }, 100000);
  });

  describe('Remote actions', () => {
    test('should select menu item', async () => {
      const renderResult = await renderMenu(true);
      const { menuMocks } = renderResult;

      await openMenu(TriggerCaption, renderResult);

      await waitFor(() => expect(menuMocks.onListGrouped).toHaveBeenCalledTimes(1));

      await clickMenuItem(RemoteMenuGrouped1.title, renderResult);

      await clickMenuItem(RemoteMenu1ItemNormal.title, renderResult);
      await waitFor(() => expect(menuMocks.onSelectMenuItem).toHaveBeenCalledTimes(1));

      expectRequestToMatchSnapshot(menuMocks.onSelectMenuItem);
      await waitMenuClosed(renderResult);
    }, 100000);

    test('should handle forms', async () => {
      const renderResult = await renderMenu(true);
      const { menuMocks, getByRole } = renderResult;

      await openMenu(TriggerCaption, renderResult);

      await waitFor(() => expect(menuMocks.onListGrouped).toHaveBeenCalledTimes(1));

      await clickMenuItem(RemoteMenuGrouped1.title, renderResult);

      await clickMenuItem(RemoteMenu1ItemForm.title, renderResult);

      await waitFor(() => expect(getByRole('dialog')).toBeTruthy());

      await setInputFieldValues(renderResult, {
        'Text to show': 'My text',
      });

      await clickButton('Continue', getByRole);

      await waitFor(() => expect(menuMocks.onSelectMenuItem).toHaveBeenCalledTimes(1));

      expectRequestToMatchSnapshot(menuMocks.onSelectMenuItem);
      await waitMenuClosed(renderResult);
    }, 100000);
  });
});
