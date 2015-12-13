import React from 'react';

import Button from 'components/semantic/Button';
import LoginStore from 'stores/LoginStore';


const ActionButton = ({ action, args, ...other }) => {
	if (action.access && !LoginStore.hasAccess(action.access)) {
		return <span/>;
	}

	return (
		<Button
			icon={ action.icon }
			onClick={ () => args ? action(...args) : action() }
			caption={ action.displayName }
			{ ...other }
		/>
	);
};

export default ActionButton;