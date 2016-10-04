import React from 'react';
import RemoteSettingForm from 'routes/Settings/components/RemoteSettingForm';
import SettingPageMixin from 'routes/Settings/mixins/SettingPageMixin';

import AutoValuePanel from './AutoValuePanel';

import t from 'utils/tcomb-form';

const Auto = {
	upload_auto_limits: t.Bool,
	upload_slots: t.Range(1),
	upload_auto_grant_speed: t.Positive,
	upload_max_granted: t.Positive,
};

const Manual = {
	upload_minislot_size: t.maybe(t.Num),
	upload_minislot_ext: t.maybe(t.Str),
};

const UploadLimitPage = React.createClass({
	mixins: [ SettingPageMixin('auto-form', 'manual-form') ],
	render() {
		return (
			<div>
				<AutoValuePanel
					ref="auto-form"
					formItems={Auto}
					type="upload"
				/>

				<RemoteSettingForm
					title="Manually set"
					ref="manual-form"
					formItems={Manual}
				/>
			</div>
		);
	}
});

export default UploadLimitPage;