import React from 'react';
import SettingForm from 'routes/Settings/components/SettingForm';

import t from 'utils/tcomb-form';

const Entry = {
	tcp_port: t.maybe(t.Num),
	udp_port: t.maybe(t.Num),
	tls_port: t.maybe(t.Num),
};

const PortsPage = React.createClass({
	render() {
		return (
			<div className="ports-settings">
				<SettingForm
					formItems={Entry}
				/>
			</div>
		);
	}
});

export default PortsPage;