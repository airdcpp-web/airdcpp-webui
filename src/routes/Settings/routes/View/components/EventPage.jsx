import React from 'react';

import RemoteSettingForm from 'routes/Settings/components/RemoteSettingForm';
import SettingPageMixin from 'routes/Settings/mixins/SettingPageMixin';

import t from 'utils/tcomb-form';


const Entry = {
	report_uploads: t.Bool,
	report_downloads: t.Bool,
	report_search_alternates: t.Bool,
	report_added_sources: t.Bool,
	report_share_skiplist: t.Bool,
	report_hashed_files: t.Bool,
	report_scheduled_refreshes: t.Bool,
	report_filelist_dupes: t.Bool,
	//report_crc_ok: t.Bool,
};

const EventPage = React.createClass({
	mixins: [ SettingPageMixin('events') ],
	render() {
		return (
			<div>
				<RemoteSettingForm
					ref="events"
					formItems={Entry}
				/>
			</div>
		);
	}
});

export default EventPage;