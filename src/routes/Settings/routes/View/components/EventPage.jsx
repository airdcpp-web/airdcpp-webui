import React from 'react';

import RemoteSettingForm from 'routes/Settings/components/RemoteSettingForm';


const Entry = [
	'report_uploads',
	'report_downloads',
	'report_search_alternates',
	'report_added_sources',
	'report_share_skiplist',
	'report_hashed_files',
	'report_scheduled_refreshes',
	'report_filelist_dupes',
	//report_crc_ok: t.Bool,
];

const EventPage = props => (
	<div>
		<RemoteSettingForm
			{ ...props }
			keys={ Entry }
		/>
	</div>
);

export default EventPage;