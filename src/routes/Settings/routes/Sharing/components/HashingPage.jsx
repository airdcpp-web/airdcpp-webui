import React from 'react';
import SettingForm from 'routes/Settings/components/SettingForm';
import SettingPageMixin from 'routes/Settings/mixins/SettingPageMixin';

import t from 'utils/tcomb-form';

const Entry = {
	max_hash_speed: t.Positive,
	max_total_hashers: t.Positive,
	max_volume_hashers: t.Positive,
};

const HashingPage = React.createClass({
	mixins: [ SettingPageMixin('form') ],
	render() {
		return (
			<div className="hashing-settings">
				<SettingForm
					ref="form"
					formItems={Entry}
				/>
			</div>
		);
	}
});

export default HashingPage;