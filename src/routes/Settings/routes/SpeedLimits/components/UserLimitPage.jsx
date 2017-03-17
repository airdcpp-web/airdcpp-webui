import React from 'react';

import AutoValuePanel from './AutoValuePanel';


const Auto = [
	'mcn_auto_limits',
	'mcn_down',
	'mcn_up',
];

const UserLimitPage = props => (
	<div>
		<AutoValuePanel
			{ ...props }
			keys={ Auto }
			type="mcn"
		/>
	</div>
);

export default UserLimitPage;