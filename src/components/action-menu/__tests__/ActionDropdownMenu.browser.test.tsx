import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { renderDataRoutes } from '@/tests/render/test-renderers';

import * as API from '@/types/api';
import * as UI from '@/types/ui';

import { waitFor } from '@testing-library/dom';

import {
  clickButton,
  clickMenuItem,
  expectRequestToMatchSnapshot,
} from '@/tests/helpers/test-helpers';
import { setInputFieldValues, setupUserEvent } from '@/tests/helpers/test-form-helpers';
import { initCommonDataMocks } from '@/tests/mocks/mock-data-common';
import { getMockServer, MockServer } from '@/tests/mocks/mock-server';
import {
  GroupedRemoteMenuListResponse,
  RemoteMenuGrouped1,
  RemoteMenuItemForm,
  RemoteMenuItemNormal,
} from '@/tests/mocks/api/menu';
import { ActionMenu } from '@/components/action-menu';
import { MENU_DIVIDER } from '@/constants/ActionConstants';
import IconConstants from '@/constants/IconConstants';
import { VIEW_FIXED_HEIGHT } from '@/tests/render/test-containers';

const RemoteMenuId = 'test-remote-menu-id';

interface TestItemType {
  id: string;
  name: string;
}

const TestActionModule = {
  moduleId: 'test',
};

const TriggerCaption = 'Open menu';
const EnableCaption = 'Enable';
const RemoveCaption = 'Remove';

const RemoveApproveCaption = 'Remove test item';

const getTestActionMenu = () => {
  const onEnable = vi.fn();
  const TestEnableAction = {
    id: 'enable',
    displayName: EnableCaption,
    icon: IconConstants.ENABLE,
    access: API.AccessEnum.SETTINGS_EDIT,
    handler: onEnable,
  };

  const onRemove = vi.fn();
  const TestRemoveAction = {
    id: 'remove',
    displayName: RemoveCaption,
    icon: IconConstants.REMOVE,
    access: API.AccessEnum.ADMIN,
    confirmation: {
      content: 'Are you sure that you want to remove the test item {{item.name}}?',
      approveCaption: RemoveApproveCaption,
      rejectCaption: `Don't remove`,
    },
    handler: onRemove,
  };

  const TestActions: UI.ActionListType<TestItemType> = {
    enable: TestEnableAction,
    divider: MENU_DIVIDER,
    remove: TestRemoveAction,
  };

  const menu = {
    moduleData: TestActionModule,
    actions: TestActions,
  };

  return { menu, onEnable, onRemove };
};

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
    const onListGrouped = vi.fn();
    server.addRequestHandler(
      'POST',
      `menus/${RemoteMenuId}/list_grouped`,
      GroupedRemoteMenuListResponse,
      onListGrouped,
    );

    const onSelectMenuItem = vi.fn();
    server.addRequestHandler(
      'POST',
      `menus/${RemoteMenuId}/select`,
      undefined,
      onSelectMenuItem,
    );

    const userEvent = setupUserEvent();
    return { commonData, server, onListGrouped, onSelectMenuItem, userEvent };
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

  const clickItem = async (
    menuItemLabel: string,
    renderResult: Awaited<ReturnType<typeof renderMenu>>,
  ) => {
    const { getByRole } = renderResult;
    await waitFor(() =>
      expect(getByRole('menuitem', { name: menuItemLabel })).toBeTruthy(),
    );

    // Click
    await clickMenuItem(menuItemLabel, renderResult);
  };

  const openMenu = async (renderResult: Awaited<ReturnType<typeof renderMenu>>) => {
    const { getByLabelText, getByRole, userEvent } = renderResult;
    await waitFor(() => expect(getByLabelText(TriggerCaption)).toBeTruthy());

    await userEvent.click(getByLabelText(TriggerCaption));

    await waitFor(() => expect(getByRole('menu')).toBeTruthy());
  };

  describe('Local actions', () => {
    test('should select menu item', async () => {
      const renderResult = await renderMenu();
      const { onEnable } = renderResult;

      await openMenu(renderResult);
      await clickItem(EnableCaption, renderResult);

      await waitFor(() => expect(onEnable).toHaveBeenCalledTimes(1));
    }, 100000);

    test('should handle confirm data', async () => {
      const renderResult = await renderMenu();
      const { onRemove, getByText, getByRole } = renderResult;

      await openMenu(renderResult);
      await clickItem(RemoveCaption, renderResult);

      await waitFor(() => expect(getByText(RemoveApproveCaption)).toBeTruthy());
      expect(onRemove).toHaveBeenCalledTimes(0);

      await clickButton(RemoveApproveCaption, getByRole);
      await waitFor(() => expect(onRemove).toHaveBeenCalledTimes(1));
    }, 100000);
  });

  describe('Remote actions', () => {
    test('should select menu item', async () => {
      const renderResult = await renderMenu(true);
      const { onListGrouped, onSelectMenuItem } = renderResult;

      await openMenu(renderResult);

      await waitFor(() => expect(onListGrouped).toHaveBeenCalledTimes(1));

      await clickItem(RemoteMenuGrouped1.title, renderResult);

      await clickItem(RemoteMenuItemNormal.title, renderResult);
      await waitFor(() => expect(onSelectMenuItem).toHaveBeenCalledTimes(1));

      expectRequestToMatchSnapshot(onSelectMenuItem);
    }, 100000);

    test('should handle forms', async () => {
      const renderResult = await renderMenu(true);
      const { onListGrouped, onSelectMenuItem, getByRole } = renderResult;

      await openMenu(renderResult);

      await waitFor(() => expect(onListGrouped).toHaveBeenCalledTimes(1));

      await clickItem(RemoteMenuGrouped1.title, renderResult);

      await clickItem(RemoteMenuItemForm.title, renderResult);

      await waitFor(() => expect(getByRole('dialog')).toBeTruthy());

      await setInputFieldValues(renderResult, {
        'Text to show': 'My text',
      });

      await clickButton('Continue', getByRole);

      await waitFor(() => expect(onSelectMenuItem).toHaveBeenCalledTimes(1));

      expectRequestToMatchSnapshot(onSelectMenuItem);
    }, 100000);
  });
});
