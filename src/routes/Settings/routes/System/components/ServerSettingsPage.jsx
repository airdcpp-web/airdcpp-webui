import React from 'react';
import SettingForm from 'routes/Settings/components/SettingForm';
import SettingPageMixin from 'routes/Settings/mixins/SettingPageMixin';

import Message from 'components/semantic/Message';

import t from 'utils/tcomb-form';

const PlainEntry = {
	web_plain_port: t.Range(1, 65535),
	web_plain_bind_address: t.maybe(t.Str),
};

const TlsEntry = {
	web_tls_port: t.Range(1, 65535),
	web_tls_bind_address: t.maybe(t.Str),

	web_tls_certificate_path: t.maybe(t.Str),
	web_tls_certificate_key_path: t.maybe(t.Str),
};

const Generic = {
	web_server_threads: t.Positive,
};

const ServerSettingsPage = React.createClass({
	mixins: [ SettingPageMixin('plain', 'tls', 'generic') ],
	render() {
		return (
			<div>
				<Message 
					description="New settings will take effect after restarting the client"
					icon="blue info"
				/>

				<div className="ui header">HTTP</div>
				<div className="ui segment">
					<SettingForm
						ref="plain"
						formItems={PlainEntry}
					/>
				</div>

				<div className="ui header">HTTPS</div>
				<div className="ui segment">
					<SettingForm
						ref="tls"
						formItems={TlsEntry}
					/>

					<Message 
						description="The default client certificate is used if the certificate paths are empty"
						icon="blue info"
					/>
				</div>

				<div className="ui header">Advanced</div>
				<div className="ui segment">
					<SettingForm
						ref="generic"
						formItems={Generic}
					/>
				</div>
			</div>
		);
	}
});

export default ServerSettingsPage;