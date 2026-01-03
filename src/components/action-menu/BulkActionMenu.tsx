import * as React from 'react';

import Dropdown from '@/components/semantic/Dropdown';
import MenuItemLink from '@/components/semantic/MenuItemLink';

import * as UI from '@/types/ui';

import {
  BulkActionHandlerDecorator,
  BulkActionClickHandler,
} from '@/decorators/BulkActionHandlerDecorator';
import {
  useBulkActionMenuItems,
  BulkActionMenuDefinition,
} from './effects/useBulkActionMenuItems';

export interface BulkActionMenuProps<
  ItemDataT extends UI.ActionMenuItemDataValueType,
  EntityT extends UI.ActionMenuItemEntityValueType,
> extends BulkActionMenuDefinition<ItemDataT, EntityT> {
  // Dropdown props
  className?: string;
  caption: React.ReactNode;
  triggerIcon?: string;
  button?: boolean;
  // Additional menu items to append (e.g., "Clear selection")
  additionalItems?: React.ReactNode;
  // Optional callback when action is clicked
  // Return true to prevent default action execution
  onActionClick?: (actionId: string, items: ItemDataT[]) => boolean;
}

interface BulkActionMenuContentProps<
  ItemDataT extends UI.ActionMenuItemDataValueType,
  EntityT extends UI.ActionMenuItemEntityValueType,
> extends BulkActionMenuProps<ItemDataT, EntityT> {
  onClickAction: BulkActionClickHandler<ItemDataT, EntityT>;
}

const BulkActionMenuContent = <
  ItemDataT extends UI.ActionMenuItemDataValueType,
  EntityT extends UI.ActionMenuItemEntityValueType,
>({
  onClickAction,
  className,
  caption,
  triggerIcon,
  button,
  additionalItems,
  ...menuProps
}: BulkActionMenuContentProps<ItemDataT, EntityT>) => {
  const { getBulkMenuItems } = useBulkActionMenuItems(menuProps);
  const menuItems = getBulkMenuItems(onClickAction);

  return (
    <Dropdown
      className={className}
      caption={caption}
      triggerIcon={triggerIcon}
      button={button}
    >
      {menuItems.map((menuItem) =>
        menuItem.item ? (
          <MenuItemLink
            key={menuItem.id}
            onClick={menuItem.item.onClick}
            icon={menuItem.item.icon}
          >
            {menuItem.item.caption}
          </MenuItemLink>
        ) : null,
      )}
      {additionalItems && (
        <>
          <div className="ui divider" />
          {additionalItems}
        </>
      )}
    </Dropdown>
  );
};

const BulkActionMenu = <
  ItemDataT extends UI.ActionMenuItemDataValueType,
  EntityT extends UI.ActionMenuItemEntityValueType,
>(
  props: BulkActionMenuProps<ItemDataT, EntityT>,
) => {
  return (
    <BulkActionHandlerDecorator<ItemDataT, EntityT>>
      {({ onClickAction }) => (
        <BulkActionMenuContent {...props} onClickAction={onClickAction} />
      )}
    </BulkActionHandlerDecorator>
  );
};

export { BulkActionMenu };
