import Button, { ButtonProps } from 'components/semantic/Button';
import { showAction, toActionI18nKey } from 'utils/ActionUtils';
import { IconType } from 'components/semantic/Icon';

import * as UI from 'types/ui';
import { ActionHandlerDecorator } from 'decorators/ActionHandlerDecorator';
import { useTranslation } from 'react-i18next';

export interface ActionButtonProps<ItemDataT extends UI.ActionItemDataValueType>
  extends Omit<ButtonProps, 'caption' | 'icon'> {
  actions: UI.ModuleActions<ItemDataT>;
  actionId: string;
  itemData?: ItemDataT;
  icon?: IconType | true;
}

const ActionButton = <ItemDataT extends UI.ActionItemDataValueType>({
  actionId,
  itemData,
  icon = true,
  actions,
  ...other
}: ActionButtonProps<ItemDataT>) => {
  const action = actions.actions[actionId]!;
  const { t } = useTranslation();
  if (!showAction(action, itemData)) {
    return null;
  }

  const { moduleId, subId } = actions;
  return (
    <ActionHandlerDecorator<ItemDataT>>
      {({ onClickAction }) => (
        <Button
          icon={icon ? (typeof icon === 'string' ? icon : action.icon) : null}
          onClick={() =>
            onClickAction({
              itemData: itemData as ItemDataT,
              action,
              actionId,
              moduleId,
              subId,
            })
          }
          caption={t(toActionI18nKey(action, moduleId), action.displayName)}
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
