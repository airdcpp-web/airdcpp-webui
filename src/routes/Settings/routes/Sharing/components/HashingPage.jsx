import React from 'react';
import SettingForm from 'routes/Settings/components/SettingForm';
import SettingPageMixin from 'routes/Settings/mixins/SettingPageMixin';

import HashDatabaseLayout from './HashDatabaseLayout';

import t from 'utils/tcomb-form';

const Entry = {
	max_hash_speed: t.Positive,
	max_total_hashers: t.Range(1),
	max_volume_hashers: t.Range(1),
};

const HashingPage = React.createClass({
	mixins: [ SettingPageMixin('form') ],
	render() {
		return (
			<div>
				<SettingForm
					ref="form"
					formItems={Entry}
				/>

				<HashDatabaseLayout/>
			</div>
		);
	}
});

export default HashingPage;