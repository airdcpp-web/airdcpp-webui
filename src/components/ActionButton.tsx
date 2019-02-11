import React from 'react';

import Button, { ButtonProps } from 'components/semantic/Button';
import { showAction, toActionI18nKey } from 'utils/ActionUtils';
import { IconType } from 'components/semantic/Icon';

import * as UI from 'types/ui';
import { ActionHandlerDecorator, ActionHandlerDecoratorChildProps } from 'decorators/ActionHandlerDecorator';
import { useTranslation } from 'react-i18next';


interface ActionButtonProps extends Omit<ButtonProps, 'caption'> {
  //action: UI.ActionType;
  actions: UI.ModuleActions<any>;
  actionId: string;
  //moduleId: string;
  itemData?: UI.ActionItemDataValueType;
  icon?: IconType;
}

const ActionButton: React.FC<ActionButtonProps & ActionHandlerDecoratorChildProps> = ({ 
  actionId, itemData, onClickAction, icon = true, 
  location, history, match, staticContext, actions,
  ...other 
}) => {
  const action = actions.actions[actionId];
  const { t } = useTranslation();
  if (!showAction(action, itemData)) {
    return null;
  }

  const { moduleId, subId } = actions;
  return (
    <Button
      icon={ icon ? (typeof icon === 'string' ? icon : action.icon) : null }
      onClick={ () => onClickAction({ 
        itemData, 
        action, 
        actionId,
        moduleId,
        subId
      }) }
      caption={ t(toActionI18nKey(action, moduleId), action.displayName) }
      { ...other }
    />
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


export default ActionHandlerDecorator<ActionButtonProps>(ActionButton);