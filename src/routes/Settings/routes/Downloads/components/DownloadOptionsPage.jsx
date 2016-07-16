import React from 'react';
import SettingForm from 'routes/Settings/components/SettingForm';
import SettingPageMixin from 'routes/Settings/mixins/SettingPageMixin';

import t from 'utils/tcomb-form';

const Entry = {
	segmented_downloads: t.Bool,
	min_segment_size: t.Positive,
	new_segment_min_speed: t.Positive,
	allow_slow_overlap: t.Bool,
	share_finished_bundles: t.Bool,
	finished_no_hash: t.Bool,
	finished_remove_exit: t.Bool,
};

const DownloadOptionsPage = React.createClass({
	mixins: [ SettingPageMixin('form') ],
	render() {
		return (
			<div>
				<SettingForm
					ref="form"
					formItems={Entry}
				/>
			</div>
		);
	}
});

export default DownloadOptionsPage;