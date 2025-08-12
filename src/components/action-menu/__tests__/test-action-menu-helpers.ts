import { MENU_DIVIDER } from '@/constants/ActionConstants';
import IconConstants from '@/constants/IconConstants';
import { MockServer } from '@/tests/mocks/mock-server';

import * as API from '@/types/api';
import * as UI from '@/types/ui';
import { vi } from 'vitest';

export interface TestActionItemType {
  id: string;
  name: string;
}

const TestActionModule = {
  moduleId: 'test',
};

export const TestItemEnableCaption = 'Enable';
export const TestItemRemoveCaption = 'Remove';

export const TestItemRemoveApproveCaption = 'Remove test item';

export const getTestActionMenu = () => {
  const onEnable = vi.fn();
  const TestEnableAction = {
    id: 'enable',
    displayName: TestItemEnableCaption,
    icon: IconConstants.ENABLE,
    access: API.AccessEnum.SETTINGS_EDIT,
    handler: onEnable,
  };

  const onRemove = vi.fn();
  const TestRemoveAction = {
    id: 'remove',
    displayName: TestItemRemoveCaption,
    icon: IconConstants.REMOVE,
    access: API.AccessEnum.ADMIN,
    confirmation: {
      content: 'Are you sure that you want to remove the test item {{item.name}}?',
      approveCaption: TestItemRemoveApproveCaption,
      rejectCaption: `Don't remove`,
    },
    handler: onRemove,
  };

  const TestActions: UI.ActionListType<TestActionItemType, TestActionItemType> = {
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

export const installActionMenuMocks = (
  menuId: string,
  listResponse: object,
  server: MockServer,
) => {
  const onListGrouped = vi.fn();
  server.addRequestHandler(
    'POST',
    `menus/${menuId}/list_grouped`,
    listResponse,
    onListGrouped,
  );

  const onSelectMenuItem = vi.fn();
  server.addRequestHandler('POST', `menus/${menuId}/select`, undefined, onSelectMenuItem);

  return {
    onListGrouped,
    onSelectMenuItem,
  };
};
