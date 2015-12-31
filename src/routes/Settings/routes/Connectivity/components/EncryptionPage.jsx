import React from 'react';
import SettingForm from 'routes/Settings/components/SettingForm';
import SettingPageMixin from 'routes/Settings/mixins/SettingPageMixin';

import t from 'utils/tcomb-form';

const Entry = {
	always_ccpm: t.Bool,
	tls_mode: t.Num,
};

const Encryption = React.createClass({
	mixins: [ SettingPageMixin('form') ],
	render() {
		return (
			<div className="encryption-settings">
				<SettingForm
					ref="form"
					formItems={Entry}
				/>
			</div>
		);
	}
});

export default Encryption;