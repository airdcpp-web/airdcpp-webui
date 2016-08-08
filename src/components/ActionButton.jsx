import React from 'react';

import Button from 'components/semantic/Button';
import { showAction } from 'utils/ActionUtils';


const ActionButton = ({ action, itemData, icon = true, ...other }, { routerLocation }) => {
	if (!showAction(action, itemData)) {
		return null;
	}

	return (
		<Button
			icon={ icon ? (typeof icon === 'string' ? icon : action.icon) : '' }
			onClick={ () => itemData ? action(itemData, routerLocation) : action(routerLocation) }
			caption={ action.displayName }
			{ ...other }
		/>
	);
};

ActionButton.propTypes = {
	action: React.PropTypes.func,

	itemData: React.PropTypes.object,

	icon: React.PropTypes.oneOfType([
		React.PropTypes.bool,
		React.PropTypes.string,
	]),
};

ActionButton.contextTypes = {
	routerLocation: React.PropTypes.object.isRequired,
};


export default ActionButton;