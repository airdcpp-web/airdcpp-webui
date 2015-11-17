import React from 'react';
import SettingForm from 'routes/Settings/components/SettingForm';
import SettingPageMixin from 'routes/Settings/mixins/SettingPageMixin';

import AutoValuePanel from './AutoValuePanel';

import t from 'utils/tcomb-form';

const Auto = {
	upload_auto_limits: t.Bool,
	upload_slots: t.Positive,
	upload_auto_grant_speed: t.Positive,
	upload_max_granted: t.Positive,
};

const Manual = {
	upload_minislot_size: t.maybe(t.Num),
	upload_minislot_ext: t.maybe(t.Num),
};

const UploadLimitPage = React.createClass({
	mixins: [ SettingPageMixin('auto-form', 'manual-form') ],
	render() {
		return (
			<div className="upload-limit-settings">
				<AutoValuePanel
					ref="auto-form"
					formItems={Auto}
				/>

				<SettingForm
					title="Manually set"
					ref="manual-form"
					formItems={Manual}
				/>
			</div>
		);
	}
});

export default UploadLimitPage;