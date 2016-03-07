import React from 'react';
import SettingForm from 'routes/Settings/components/SettingForm';
import SettingPageMixin from 'routes/Settings/mixins/SettingPageMixin';

import Message from 'components/semantic/Message';

import t from 'utils/tcomb-form';

const Entry = {
	always_ccpm: t.Bool,
	tls_mode: t.Num,
};

const PathEntry = {
	use_default_cert_paths: t.Bool,
	tls_certificate_file: t.Str,
	tls_private_key_file: t.Str,
};

const Encryption = React.createClass({
	mixins: [ SettingPageMixin('form', 'path-form') ],
	onFieldSetting(id, fieldOptions, formValue, settingInfo) {
		const useDefault = formValue['use_default_cert_paths'];
		if (useDefault && (id.indexOf('tls_certificate_file') === 0 || id.indexOf('tls_private_key_file') === 0)) {
			fieldOptions['disabled'] = true;
		}
	},

	render() {
		return (
			<div className="encryption-settings">
				<SettingForm
					ref="form"
					formItems={Entry}
				/>

				<div className="ui form header">Certificate files</div>
				<Message
					icon="blue info"
					description="New certificates will be used after the client is restarted"
				/>
				<SettingForm
					ref="path-form"
					formItems={PathEntry}
					onFieldSetting={ this.onFieldSetting }
				/>
			</div>
		);
	}
});

export default Encryption;