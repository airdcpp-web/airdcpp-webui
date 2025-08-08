import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { renderDataRoutes } from '@/tests/render/test-renderers';

import { waitFor } from '@testing-library/dom';

import {
  clickMenuItem,
  expectRequestToMatchSnapshot,
} from '@/tests/helpers/test-helpers';
import { setupUserEvent } from '@/tests/helpers/test-form-helpers';
import { initCommonDataMocks } from '@/tests/mocks/mock-data-common';
import { getMockServer, MockServer } from '@/tests/mocks/mock-server';
import {
  RemoteMenu2Item,
  RemoteMenuGrouped1,
  RemoteMenuGrouped2,
} from '@/tests/mocks/api/menu';
import { ActionMenu, UserMenu } from '@/components/action-menu';
import { VIEW_FIXED_HEIGHT } from '@/tests/render/test-containers';
import { MockUser1Response } from '@/tests/mocks/api/user';
import UserConstants from '@/constants/UserConstants';
import { getTestActionMenu, installActionMenuMocks } from './test-action-menu-helpers';

const RemoteMenuId1 = 'test-remote-menu-id';
const RemoteMenuId2 = 'test-remote-menu-id-2';

// tslint:disable:no-empty
describe('User menu', () => {
  let server: MockServer;

  beforeEach(() => {
    server = getMockServer();
  });

  afterEach(() => {
    server.stop();
  });

  const getSocket = async () => {
    const commonData = await initCommonDataMocks(server);

    // User handlers
    const onIgnoreUser = vi.fn();
    server.addRequestHandler(
      'POST',
      `${UserConstants.IGNORES_URL}/${MockUser1Response.cid}`,
      undefined,
      onIgnoreUser,
    );

    // Remote menu mocks
    const menu1Mocks = installActionMenuMocks(
      RemoteMenuId1,
      [RemoteMenuGrouped1],
      server,
    );

    const userEvent = setupUserEvent();
    return {
      commonData,
      server,

      menu1Mocks,

      onIgnoreUser,
      userEvent,
    };
  };

  const renderMenu = async (enabledRemoteMenu2?: boolean) => {
    const { commonData, server, ...other } = await getSocket();

    const { menu, ...actionHandlers } = getTestActionMenu();

    const onSave = vi.fn(() => Promise.resolve());

    const UserDropdownMenuTest = () => {
      const testItemData = { id: 'test', name: 'Test Item' };
      const testEntity = { id: 'test-entity', name: 'Test Entity' };
      return (
        <UserMenu
          remoteMenuId={RemoteMenuId1}
          user={MockUser1Response}
          label={MockUser1Response.nicks}
        >
          <ActionMenu
            actions={menu}
            itemData={testItemData}
            entity={testEntity}
            remoteMenuId={enabledRemoteMenu2 ? RemoteMenuId2 : undefined}
            remoteMenuNestingThreshold={2}
          />
        </UserMenu>
      );
    };

    const routes = [
      {
        index: true,
        Component: UserDropdownMenuTest,
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
    await waitFor(() => expect(getByLabelText(MockUser1Response.nicks)).toBeTruthy());

    await userEvent.click(getByLabelText(MockUser1Response.nicks));

    await waitFor(() => expect(getByRole('menu')).toBeTruthy());
  };

  const waitMenuClosed = async ({
    queryByRole,
  }: Awaited<ReturnType<typeof renderMenu>>) => {
    await waitFor(() => expect(queryByRole('menu')).not.toBeInTheDocument());
  };

  describe('Standalone', () => {
    test('should select local item', async () => {
      const renderResult = await renderMenu();
      const { onIgnoreUser } = renderResult;

      await openMenu(renderResult);
      await clickItem('Ignore messages', renderResult);

      await waitFor(() => expect(onIgnoreUser).toHaveBeenCalledTimes(1));
      await waitMenuClosed(renderResult);
    }, 100000);
  });

  describe('Nested', () => {
    test('should select menu item', async () => {
      const menu2Mocks = installActionMenuMocks(
        RemoteMenuId2,
        [RemoteMenuGrouped2],
        server,
      );

      const renderResult = await renderMenu(true);

      await openMenu(renderResult);

      await waitFor(() => expect(menu2Mocks.onListGrouped).toHaveBeenCalledTimes(1));

      await clickItem(RemoteMenuGrouped1.title, renderResult);

      await clickItem(RemoteMenu2Item.title, renderResult);
      await waitFor(() => expect(menu2Mocks.onSelectMenuItem).toHaveBeenCalledTimes(1));

      expectRequestToMatchSnapshot(menu2Mocks.onSelectMenuItem);
      await waitMenuClosed(renderResult);
    }, 100000);

    test('should merge duplicate menus', async () => {
      const renderResult = await renderMenu(true);

      const menu2Mocks = installActionMenuMocks(
        RemoteMenuId2,
        [RemoteMenuGrouped1, RemoteMenuGrouped2],
        server,
      );

      const { findAllByText, menu1Mocks } = renderResult;

      await openMenu(renderResult);

      await waitFor(() => expect(menu1Mocks.onListGrouped).toHaveBeenCalledTimes(1));
      await waitFor(() => expect(menu2Mocks.onListGrouped).toHaveBeenCalledTimes(1));

      const menu1Submenus = await findAllByText(RemoteMenuGrouped1.title);
      expect(menu1Submenus).toHaveLength(1);

      const menu2Items = await findAllByText(RemoteMenu2Item.title);
      expect(menu2Items).toHaveLength(1);

      await clickItem(RemoteMenuGrouped1.title, renderResult);

      await clickItem(RemoteMenu2Item.title, renderResult);
      await waitFor(() => expect(menu2Mocks.onSelectMenuItem).toHaveBeenCalledTimes(1));

      expectRequestToMatchSnapshot(menu2Mocks.onSelectMenuItem);
      await waitMenuClosed(renderResult);
    }, 100000);
  });
});
