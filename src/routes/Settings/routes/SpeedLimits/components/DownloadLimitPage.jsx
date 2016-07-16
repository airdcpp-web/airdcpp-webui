import React from 'react';
import SettingPageMixin from 'routes/Settings/mixins/SettingPageMixin';
import AutoValuePanel from './AutoValuePanel';

import t from 'utils/tcomb-form';

const Auto = {
	download_auto_limits: t.Bool,
	download_slots: t.Positive,
	download_max_start_speed: t.Positive,
	download_highest_prio_slots: t.Positive,
};

const DownloadLimitPage = React.createClass({
	mixins: [ SettingPageMixin('auto-form') ],
	render() {
		return (
			<div>
				<AutoValuePanel
					ref="auto-form"
					formItems={ Auto }
					type="download"
				/>
			</div>
		);
	}
});

export default DownloadLimitPage;