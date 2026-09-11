import * as React from 'react';

import MenuItemLink from '@/components/semantic/MenuItemLink';
import Icon from '@/components/semantic/Icon';
import IconConstants from '@/constants/IconConstants';
import { useTableSelectionContext } from './SelectionContext';
import { BulkActionMenu } from '@/components/action-menu/BulkActionMenu';

import * as UI from '@/types/ui';

import './style.css';

export interface SelectionFooterBarProps<
  ItemDataT extends UI.ActionMenuItemDataValueType,
  EntityT extends UI.ActionMenuItemEntityValueType,
> {
  // Action definitions module (e.g., DownloadableItemActionMenu)
  actions: UI.ModuleActions<ItemDataT, EntityT>;
  // Selected items for bulk operations
  items: ItemDataT[];
  // Optional entity context (e.g., search instance)
  entity?: EntityT;
  // Optional: only show these action IDs from the module
  actionIds?: string[];
  // Translation function
  t: UI.TranslateF;
}

export const SelectionFooterBar = <
  ItemDataT extends UI.ActionMenuItemDataValueType,
  EntityT extends UI.ActionMenuItemEntityValueType,
>({
  actions,
  items,
  entity,
  actionIds,
  t,
}: SelectionFooterBarProps<ItemDataT, EntityT>) => {
  const { selectedCount, clearSelection } = useTableSelectionContext();

  const handleClearClick = () => {
    clearSelection();
  };

  // Nothing selected: render nothing rather than an empty bar in the table footer
  if (selectedCount === 0) {
    return null;
  }

  return (
    <div className="selection-footer-bar">
      <div className="selection-right">
        <BulkActionMenu
          className="selection-dropdown mini primary"
          button={true}
          caption={
            <>
              <Icon icon={IconConstants.DOWNLOAD} />
              <span className="selection-count">
                {t('selectedCount', {
                  defaultValue: '{{count}} selected',
                  count: selectedCount,
                })}
              </span>
            </>
          }
          triggerIcon={IconConstants.EXPAND}
          actions={actions}
          items={items}
          entity={entity}
          ids={actionIds}
          additionalItems={
            <MenuItemLink onClick={handleClearClick} icon={IconConstants.CLOSE}>
              {t('clearSelection', 'Clear selection')}
            </MenuItemLink>
          }
        />
      </div>
    </div>
  );
};

export default SelectionFooterBar;
