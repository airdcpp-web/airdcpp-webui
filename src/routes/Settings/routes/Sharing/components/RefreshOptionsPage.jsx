import React from 'react';
import RemoteSettingForm from 'routes/Settings/components/RemoteSettingForm';


const Entry = [
	'refresh_time',
	'refresh_time_incoming',
	'refresh_startup',
	'refresh_threading',
];

const RefreshOptionsPage = props => (
	<div>
		<RemoteSettingForm
			{ ...props }
			keys={ Entry }
		/>
	</div>
);

export default RefreshOptionsPage;