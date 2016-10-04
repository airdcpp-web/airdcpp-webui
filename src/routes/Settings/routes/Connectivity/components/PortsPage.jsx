import React from 'react';
import RemoteSettingForm from 'routes/Settings/components/RemoteSettingForm';
import SettingPageMixin from 'routes/Settings/mixins/SettingPageMixin';

import t from 'utils/tcomb-form';

const Entry = {
	tcp_port: t.Range(1, 65535),
	udp_port: t.Range(1, 65535),
	tls_port: t.Range(1, 65535),
	preferred_port_mapper: t.Str,
};

const PortsPage = React.createClass({
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

export default PortsPage;