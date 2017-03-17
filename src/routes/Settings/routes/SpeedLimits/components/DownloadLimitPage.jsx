import React from 'react';
import AutoValuePanel from './AutoValuePanel';

const Auto = [
	'download_auto_limits',
	'download_slots',
	'download_max_start_speed',
	'download_highest_prio_slots',
];

const DownloadLimitPage = props => (
	<div>
		<AutoValuePanel
			{ ...props }
			keys={ Auto }
			type="download"
		/>
	</div>
);

export default DownloadLimitPage;