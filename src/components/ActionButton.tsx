import Button, { ButtonProps } from 'components/semantic/Button';
import { showAction, toActionI18nKey } from 'utils/ActionUtils';
import { IconType } from 'components/semantic/Icon';

import * as UI from 'types/ui';
import { ActionHandlerDecorator } from 'decorators/ActionHandlerDecorator';
import { useTranslation } from 'react-i18next';

export interface ActionButtonProps<ItemDataT extends UI.ActionItemDataValueType>
  extends Omit<ButtonProps, 'caption' | 'icon'> {
  action: UI.ActionDefinition<ItemDataT>;
  moduleData: UI.ActionModuleData;
  itemData?: ItemDataT;
  icon?: IconType | true;
}

const ActionButton = <ItemDataT extends UI.ActionItemDataValueType>({
  action,
  itemData,
  icon = true,
  moduleData,
  ...other
}: ActionButtonProps<ItemDataT>) => {
  const { t } = useTranslation();
  if (!showAction(action, itemData)) {
    return null;
  }

  const { moduleId } = moduleData;
  return (
    <ActionHandlerDecorator<ItemDataT>>
      {({ onClickAction }) => (
        <Button
          icon={icon ? (typeof icon === 'string' ? icon : action.icon) : null}
          onClick={() =>
            onClickAction({
              itemData: itemData as ItemDataT,
              action,
              moduleData,
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
