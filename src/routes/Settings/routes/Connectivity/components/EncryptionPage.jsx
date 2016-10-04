import React from 'react';
import RemoteSettingForm from 'routes/Settings/components/RemoteSettingForm';
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
			<div>
				<RemoteSettingForm
					ref="form"
					formItems={Entry}
				/>
			</div>
		);
	}
});

export default Encryption;