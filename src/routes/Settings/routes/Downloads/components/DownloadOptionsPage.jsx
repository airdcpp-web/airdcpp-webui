import React from 'react';
import SettingForm from 'routes/Settings/components/SettingForm';
import SettingPageMixin from 'routes/Settings/mixins/SettingPageMixin';

import t from 'utils/tcomb-form';

const Entry = {
	segmented_downloads: t.Bool,
	min_segment_size: t.Num,
	new_segment_min_speed: t.Num,
	allow_slow_overlap: t.Bool,
	share_finished_bundles: t.Bool,
};

const DownloadOptionsPage = React.createClass({
	mixins: [ SettingPageMixin('form') ],
	render() {
		return (
			<div className="skipping-options-settings">
				<SettingForm
					ref="form"
					formItems={Entry}
				/>
			</div>
		);
	}
});

export default DownloadOptionsPage;