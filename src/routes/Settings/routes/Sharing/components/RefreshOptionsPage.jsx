import React from 'react';
import SettingForm from 'routes/Settings/components/SettingForm';
import SettingPageMixin from 'routes/Settings/mixins/SettingPageMixin';

import t from 'utils/tcomb-form';

const Entry = {
	refresh_time: t.Positive,
	refresh_time_incoming: t.Positive,
	refresh_startup: t.Bool,
	refresh_threading: t.Num,
};

const RefreshOptionsPage = React.createClass({
	mixins: [ SettingPageMixin('form') ],
	render() {
		return (
			<div className="refresh-options-settings">
				<SettingForm
					ref="form"
					formItems={Entry}
				/>
			</div>
		);
	}
});

export default RefreshOptionsPage;