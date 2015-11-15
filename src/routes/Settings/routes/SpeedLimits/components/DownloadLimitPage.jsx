import React from 'react';
//import SettingForm from 'routes/Settings/components/SettingForm';
import SettingPageMixin from 'routes/Settings/mixins/SettingPageMixin';
import AutoValuePanel from './AutoValuePanel';

import t from 'utils/tcomb-form';

const Auto = {
	download_auto_limits: t.Bool,
	download_slots: t.maybe(t.Num),
	download_max_start_speed: t.maybe(t.Num),
	download_highest_prio_slots: t.maybe(t.Num),
};

const DownloadLimitPage = React.createClass({
	mixins: [ SettingPageMixin('auto-form') ],
	render() {
		return (
			<div className="download-limit-settings">
				<AutoValuePanel
					ref="auto-form"
					formItems={Auto}
				/>
			</div>
		);
	}
});

export default DownloadLimitPage;