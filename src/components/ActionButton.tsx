import Button, { ButtonProps } from 'components/semantic/Button';
import { showAction, translateActionName } from 'utils/ActionUtils';
import { IconType } from 'components/semantic/Icon';

import * as UI from 'types/ui';
import { ActionHandlerDecorator } from 'decorators/ActionHandlerDecorator';
import { useTranslation } from 'react-i18next';

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
  if (!showAction(action, itemData)) {
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

/*ActionButton.propTypes = {
  action: PropTypes.func,

  itemData: PropTypes.object,

  icon: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]),
};*/

//export default ActionHandlerDecorator<ActionButtonProps<ItemDataT>, ItemDataT>(ActionButton);
export default ActionButton;
