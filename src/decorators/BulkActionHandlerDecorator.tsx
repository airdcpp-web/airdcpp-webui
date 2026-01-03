import { useState } from 'react';
import * as React from 'react';

import { Location } from 'react-router';

import * as UI from '@/types/ui';

import { translate } from '@/utils/TranslationUtils';
import NotificationActions from '@/actions/NotificationActions';
import { useActionHandlerContext } from './hooks/useActionHandlerContext';

export interface BulkActionData<
  ItemDataT extends UI.ActionDataValueType,
  EntityT extends UI.ActionEntityValueType,
> {
  action: UI.ActionDefinition<ItemDataT, EntityT>;
  items: ItemDataT[];
  entity: EntityT;
  moduleData: UI.ActionModuleData;
}

export type BulkActionClickHandler<
  ItemDataT extends UI.ActionDataValueType,
  EntityT extends UI.ActionEntityValueType = void,
> = (actionData: BulkActionData<ItemDataT, EntityT>) => void;

export interface BulkActionHandlerDecoratorChildProps<
  ItemDataT extends UI.ActionDataValueType,
  EntityT extends UI.ActionEntityValueType,
> {
  onClickAction: BulkActionClickHandler<ItemDataT, EntityT>;
  location: Location;
}

interface BulkActionHandlerDecoratorProps<
  ItemDataT extends UI.ActionDataValueType,
  EntityT extends UI.ActionEntityValueType,
> {
  children: (
    props: BulkActionHandlerDecoratorChildProps<ItemDataT, EntityT>,
  ) => React.ReactNode;
}

const BulkActionHandlerDecorator = <
  ItemDataT extends UI.ActionDataValueType,
  EntityT extends UI.ActionEntityValueType = void,
>(
  props: BulkActionHandlerDecoratorProps<ItemDataT, EntityT>,
) => {
  const { t, location, getHandlerProps } = useActionHandlerContext();
  const [isExecuting, setIsExecuting] = useState(false);

  const handleClickAction: BulkActionClickHandler<ItemDataT, EntityT> = async (actionData) => {
    if (isExecuting) return;

    const { action, items, entity } = actionData;
    setIsExecuting(true);

    try {
      const handlerProps = getHandlerProps();

      // Check if action has a bulk-specific handler
      if (action.bulk?.handler) {
        // Use bulk handler - receives array of items
        const handlerData: UI.ActionHandlerData<ItemDataT[], EntityT> = {
          itemData: items,
          entity,
          ...handlerProps,
        };

        await action.bulk.handler(handlerData);
      } else {
        // Fall back to calling single-item handler for each item
        const results = await Promise.allSettled(
          items.map(async (item) => {
            const handlerData: UI.ActionHandlerData<ItemDataT, EntityT> = {
              itemData: item,
              entity,
              ...handlerProps,
            };

            return action.handler(handlerData);
          }),
        );

        // Count successes and failures
        const succeeded = results.filter((r) => r.status === 'fulfilled').length;
        const failed = results.filter((r) => r.status === 'rejected').length;

        if (failed > 0 && succeeded > 0) {
          NotificationActions.warning({
            title: translate('Bulk action partially completed', t, UI.Modules.COMMON),
            message: t('bulkActionPartialMessage', {
              defaultValue: '{{succeeded}} succeeded, {{failed}} failed',
              succeeded,
              failed,
            }),
          });
        } else if (failed > 0) {
          NotificationActions.error({
            title: translate('Bulk action failed', t, UI.Modules.COMMON),
            message: t('bulkActionFailMessage', {
              defaultValue: '{{count}} items failed',
              count: failed,
            }),
          });
        }
        // Success notification is typically handled by the individual action
      }
    } catch (e: any) {
      NotificationActions.error({
        title: translate('Action failed', t, UI.Modules.COMMON),
        message: e?.message || 'Unknown error',
      });
    } finally {
      setIsExecuting(false);
    }
  };

  const { children } = props;
  return (
    <>
      {children({
        onClickAction: handleClickAction,
        location,
      })}
    </>
  );
};

export { BulkActionHandlerDecorator };
