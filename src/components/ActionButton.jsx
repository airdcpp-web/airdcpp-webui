import React from 'react';

import Button from 'components/semantic/Button';


const ActionButton = ({ action, args, ...other }) => (
	<Button
		icon={ action.icon }
		onClick={ () => args ? action(...args) : action() }
		caption={ action.displayName }
		{ ...other }
	/>
);

export default ActionButton;