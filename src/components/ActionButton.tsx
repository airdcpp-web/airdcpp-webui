import Button, { ButtonProps } from '@/components/semantic/Button';
import { showAction, translateActionName } from '@/utils/ActionUtils';
import { IconType } from '@/components/semantic/Icon';

import * as UI from '@/types/ui';
import { ActionHandlerDecorator } from '@/decorators/ActionHandlerDecorator';
import { useTranslation } from 'react-i18next';
import { useSession } from '@/context/SessionContext';

export interface ActionButtonProps<
  ItemDataT extends UI.ActionDataValueType,
  EntityT extends UI.ActionEntityValueType,
> extends Omit<ButtonProps, 'caption' | 'icon'> {
  action: UI.ActionDefinition<ItemDataT, EntityT>;
  moduleData: UI.ActionModuleData;
  itemData?: ItemDataT;
  entity?: EntityT;
  icon?: IconType | true;
}

const ActionButton = <
  ItemDataT extends UI.ActionDataValueType,
  EntityT extends UI.ActionEntityValueType,
>({
  action,
  itemData,
  entity,
  icon = true,
  moduleData,
  ...other
}: ActionButtonProps<ItemDataT, EntityT>) => {
  const { t } = useTranslation();
  const session = useSession();
  if (!showAction(action, itemData, session)) {
    return null;
  }

  return (
    <ActionHandlerDecorator<ItemDataT, EntityT>>
      {({ onClickAction }) => (
        <Button
          icon={icon ? (typeof icon === 'string' ? icon : action.icon) : null}
          onClick={() =>
            onClickAction({
              itemData: itemData as ItemDataT,
              action,
              entity: entity as EntityT,
              moduleData,
            })
          }
          caption={translateActionName(action, moduleData, t)}
          {...other}
        />
      )}
    </ActionHandlerDecorator>
  );
};

export default ActionButton;
