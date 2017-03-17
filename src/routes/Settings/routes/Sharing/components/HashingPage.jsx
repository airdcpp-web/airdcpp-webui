import React from 'react';
import RemoteSettingForm from 'routes/Settings/components/RemoteSettingForm';

import HashDatabaseLayout from './HashDatabaseLayout';

const Entry = [
	'max_hash_speed',
	'max_total_hashers',
	'max_volume_hashers',
];

const HashingPage = props => (
	<div>
		<RemoteSettingForm
			{ ...props }
			keys={ Entry }
		/>

		<HashDatabaseLayout/>
	</div>
);

export default HashingPage;