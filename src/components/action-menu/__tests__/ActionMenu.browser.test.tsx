import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { renderDataRoutes } from '@/tests/render/test-renderers';

import { waitFor } from '@testing-library/dom';

import {
  clickButton,
  waitExpectRequestToMatchSnapshot,
} from '@/tests/helpers/test-helpers';
import { setInputFieldValues, setupUserEvent } from '@/tests/helpers/test-form-helpers';
import { initCommonDataMocks } from '@/tests/mocks/mock-data-common';
import { getMockServer, MockServer } from '@/tests/mocks/mock-server';
import {
  RemoteMenuGrouped1,
  RemoteMenu1ItemForm,
  RemoteMenu1ItemNormal,
  RemoteMenuGrouped2,
  RemoteMenu1ItemWithChildren,
} from '@/tests/mocks/api/menu';
import {
  ActionMenu as ActionDropdownMenu,
  TableActionMenu,
} from '@/components/action-menu';
import { VIEW_FIXED_HEIGHT } from '@/tests/render/test-containers';
import {
  getTestActionMenu,
  installActionMenuMocks,
  TestActionItemType,
  TestItemEnableCaption,
  TestItemRemoveApproveCaption,
  TestItemRemoveCaption,
} from './test-action-menu-helpers';
import {
  clickMenuItem,
  clickSubMenu,
  openMenu,
  waitMenuClosed,
} from '@/tests/helpers/test-menu-helpers';
import { RemoteMenuData } from '../effects/helpers/remoteMenuFetcher';
import { ActionMenuDecoratorProps } from '../decorators/ActionMenuDecorator';

const RemoteMenuId = 'test-remote-menu-id';

const TriggerCaption = 'Open menu';
// tslint:disable:no-empty
describe('Action menu', () => {
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

  type ActionMenuComponentType = React.ComponentType<
    ActionMenuDecoratorProps<TestActionItemType, TestActionItemType> &
      Partial<RemoteMenuData>
  >;

  const renderMenu = async (
    Component: ActionMenuComponentType,
    useRemoteMenu = false,
  ) => {
    const { commonData, server, ...other } = await getSocket();

    const { menu, ...actionHandlers } = getTestActionMenu();

    const onSave = vi.fn(() => Promise.resolve());

    const ActionDropdownMenuTest = () => {
      const testItemData = { id: 'test', name: 'Test Item' };
      const testEntity = { id: 'test-entity', name: 'Test Entity' };
      return (
        <Component
          caption={TriggerCaption}
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

  const createMenuTests = (Component: ActionMenuComponentType) => {
    describe('Local actions', () => {
      test('should select menu item', async () => {
        const renderResult = await renderMenu(Component);
        const { onEnable } = renderResult;

        await openMenu(TriggerCaption, renderResult);
        await clickMenuItem(TestItemEnableCaption, renderResult);

        await waitFor(() => expect(onEnable).toHaveBeenCalledTimes(1));
        await waitMenuClosed(renderResult);
      }, 100000);

      test('should handle confirm data', async () => {
        const renderResult = await renderMenu(Component);
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
        const renderResult = await renderMenu(Component, true);
        const { menuMocks } = renderResult;

        await openMenu(TriggerCaption, renderResult);

        await waitFor(() => expect(menuMocks.onListGrouped).toHaveBeenCalledTimes(1));

        const { clickSubMenuItem } = await clickSubMenu(
          RemoteMenuGrouped1.title,
          renderResult,
        );
        await clickSubMenuItem(RemoteMenu1ItemNormal.title);

        await waitExpectRequestToMatchSnapshot(menuMocks.onSelectMenuItem);
        await waitMenuClosed(renderResult);
      }, 100000);

      test('should handle forms', async () => {
        const renderResult = await renderMenu(Component, true);
        const { menuMocks, getByRole } = renderResult;

        await openMenu(TriggerCaption, renderResult);

        await waitFor(() => expect(menuMocks.onListGrouped).toHaveBeenCalledTimes(1));

        const { clickSubMenuItem } = await clickSubMenu(
          RemoteMenuGrouped1.title,
          renderResult,
        );
        await clickSubMenuItem(RemoteMenu1ItemForm.title);

        await waitFor(() => expect(getByRole('dialog')).toBeTruthy());

        await setInputFieldValues(renderResult, {
          'Text to show': 'My text',
        });

        await clickButton('Continue', getByRole);

        await waitExpectRequestToMatchSnapshot(menuMocks.onSelectMenuItem);
        await waitMenuClosed(renderResult);
      }, 100000);

      test('should handle deep nesting', async () => {
        const renderResult = await renderMenu(Component, true);
        const { menuMocks } = renderResult;

        await openMenu(TriggerCaption, renderResult);

        await waitFor(() => expect(menuMocks.onListGrouped).toHaveBeenCalledTimes(1));

        // Go to first level
        const { clickSubMenu: clickSubMenuLevel1 } = await clickSubMenu(
          RemoteMenuGrouped1.title,
          renderResult,
        );

        // Go to second level
        const level1Item = RemoteMenu1ItemWithChildren;
        const { clickSubMenu: clickSubMenuLevel2 } = await clickSubMenuLevel1(
          level1Item.title,
        );

        // Go to third level
        const level2Item = level1Item.children[0];
        const { clickSubMenuItem } = await clickSubMenuLevel2(level2Item.title);

        // TODO: menus use different role for the return button
        // Test return to parent
        //await returnToParent();

        // Go back to third level
        //const level3Item = level2Item.children![0];
        //const { clickSubMenuItem } = await clickSubMenuLevel2(level2Item.title);

        // Click an item
        const level3Item = level2Item.children![0];
        await clickSubMenuItem(level3Item.title);

        await waitExpectRequestToMatchSnapshot(menuMocks.onSelectMenuItem);
      }, 100000);
    });
  };

  describe('ActionDropdownMenu', () => {
    createMenuTests(ActionDropdownMenu);
  });

  describe('TableActionMenu', () => {
    createMenuTests(TableActionMenu);
  });
});
