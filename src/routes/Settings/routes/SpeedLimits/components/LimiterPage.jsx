import React from 'react';
import RemoteSettingForm from 'routes/Settings/components/RemoteSettingForm';

const Entry = [
	'upload_limit_main',
	'download_limit_main',
	//limit_use_with_auto_values: t.Bool,
];

const LimiterPage = props => (
	<div>
		<RemoteSettingForm
			{ ...props }
			keys={ Entry }
		/>
	</div>
);

export default LimiterPage;