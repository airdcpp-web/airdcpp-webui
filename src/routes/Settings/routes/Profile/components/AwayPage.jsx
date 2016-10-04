import React from 'react';
import RemoteSettingForm from 'routes/Settings/components/RemoteSettingForm';
import SettingPageMixin from 'routes/Settings/mixins/SettingPageMixin';

import t from 'utils/tcomb-form';

const Entry = {
	away_message: t.maybe(t.Str),
	away_no_bots: t.Bool,
	away_idle_time: t.Positive,
};

const AwayPage = React.createClass({
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

export default AwayPage;