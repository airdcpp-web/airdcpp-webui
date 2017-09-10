import PropTypes from 'prop-types';
import React from 'react';

import Button from 'components/semantic/Button';
import { showAction } from 'utils/ActionUtils';


const ActionButton = ({ action, itemData, icon = true, ...other }, { routerLocation }) => {
  if (!showAction(action, itemData)) {
    return null;
  }

  return (
    <Button
      icon={ icon ? (typeof icon === 'string' ? icon : action.icon) : null }
      onClick={ () => itemData ? action(itemData, routerLocation) : action(routerLocation) }
      caption={ action.displayName }
      { ...other }
    />
  );
};

ActionButton.propTypes = {
  action: PropTypes.func,

  itemData: PropTypes.object,

  icon: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]),
};

ActionButton.contextTypes = {
  routerLocation: PropTypes.object.isRequired,
};


export default ActionButton;