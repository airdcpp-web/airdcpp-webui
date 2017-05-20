import React from 'react';
import RemoteSettingForm from 'routes/Settings/components/RemoteSettingForm';

const Entry = [
	'segmented_downloads',
	'min_segment_size',
	'new_segment_min_speed',
	'allow_slow_overlap',
	'finished_remove_exit',
	'use_partial_sharing',
];

const DownloadOptionsPage = props => (
	<div>
		<RemoteSettingForm
			{ ...props }
			keys={ Entry }
		/>
	</div>
);

export default DownloadOptionsPage;