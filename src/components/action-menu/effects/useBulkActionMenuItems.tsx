import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import * as UI from '@/types/ui';
import { showBulkAction, toActionI18nKey } from '@/utils/ActionUtils';
import { useSession } from '@/context/AppStoreContext';
import { BulkActionClickHandler } from '@/decorators/BulkActionHandlerDecorator';

export interface BulkActionMenuDefinition<
  ItemDataT extends UI.ActionMenuItemDataValueType,
  EntityT extends UI.ActionMenuItemEntityValueType,
> {
  // The action definitions module
  actions: UI.ModuleActions<ItemDataT, EntityT>;
  // Array of items for bulk operation
  items: ItemDataT[];
  // Optional entity context
  entity?: EntityT;
  // Optional: only show these action IDs
  ids?: string[];
  // Optional callback when action is clicked
  // Return true to prevent default action execution
  onActionClick?: (actionId: string, items: ItemDataT[]) => boolean;
}

export interface BulkActionMenuItem {
  id: string;
  item?: {
    onClick: () => void;
    caption: string;
    icon?: string;
  };
}

export const useBulkActionMenuItems = <
  ItemDataT extends UI.ActionMenuItemDataValueType,
  EntityT extends UI.ActionMenuItemEntityValueType,
>(
  props: BulkActionMenuDefinition<ItemDataT, EntityT>,
) => {
  const session = useSession();
  const { t } = useTranslation();

  const getBulkMenuItems = useCallback(
    (onClickAction: BulkActionClickHandler<ItemDataT, EntityT>): BulkActionMenuItem[] => {
      const { actions: moduleActions, items, entity, ids, onActionClick } = props;
      const menuItems: BulkActionMenuItem[] = [];

      // Iterate through actions and filter to bulk-enabled ones
      Object.keys(moduleActions.actions).forEach((actionId) => {
        // Skip if not in the requested IDs list
        if (ids && !ids.includes(actionId)) {
          return;
        }

        const action = moduleActions.actions[actionId];

        // Skip dividers and grouped actions for now
        if (!action || action === null || 'children' in action) {
          return;
        }

        // Check if action supports bulk and passes filters
        if (!showBulkAction(action, items, session)) {
          return;
        }

        menuItems.push({
          id: actionId,
          item: {
            onClick: () => {
              // Allow parent to intercept action (e.g., for dialog handling)
              if (onActionClick?.(actionId, items)) {
                return; // Parent handled the action
              }

              // Default: execute action via BulkActionHandlerDecorator
              onClickAction({
                action,
                items,
                entity: entity as EntityT,
                moduleData: moduleActions.moduleData,
              });
            },
            caption: t(toActionI18nKey(action, moduleActions.moduleData.moduleId), action.displayName),
            icon: action.icon,
          },
        });
      });

      return menuItems;
    },
    [props, session, t],
  );

  return { getBulkMenuItems };
};
