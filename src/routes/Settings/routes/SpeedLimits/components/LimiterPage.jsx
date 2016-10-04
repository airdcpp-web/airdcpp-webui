import React from 'react';
import RemoteSettingForm from 'routes/Settings/components/RemoteSettingForm';
import SettingPageMixin from 'routes/Settings/mixins/SettingPageMixin';

import t from 'utils/tcomb-form';

const Entry = {
	upload_limit_main: t.Positive,
	download_limit_main: t.Positive,
	//limit_use_with_auto_values: t.Bool,
};

const LimiterPage = React.createClass({
	mixins: [ SettingPageMixin('form') ],
	render() {
		return (
			<div>
				<RemoteSettingForm
					ref="form"
					formItems={Entry}
				/>
			</div>
		);
	}
});

export default LimiterPage;