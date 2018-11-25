import React from 'react';

import Button, { ButtonProps } from 'components/semantic/Button';
import { showAction } from 'utils/ActionUtils';
import { IconType } from 'components/semantic/Icon';

import * as UI from 'types/ui';
import { ActionHandlerDecorator, ActionHandlerDecoratorChildProps } from 'decorators/ActionHandlerDecorator';


interface ActionButtonProps extends Omit<ButtonProps, 'caption'> {
  action: UI.ActionType;
  itemData?: UI.ActionItemDataValueType;
  icon?: IconType;
}

const ActionButton: React.FC<ActionButtonProps & ActionHandlerDecoratorChildProps> = (
  { action, itemData, onClickAction, icon = true, location, history, match, staticContext, ...other }
) => {
  if (!showAction(action, itemData)) {
    return null;
  }

  return (
    <Button
      icon={ icon ? (typeof icon === 'string' ? icon : action.icon) : null }
      onClick={ () => onClickAction({ 
        itemData, 
        action, 
        actionId: '' // TODO: figure this out when refactoring actions
      }) }
      caption={ action.displayName }
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


export default ActionHandlerDecorator(ActionButton);