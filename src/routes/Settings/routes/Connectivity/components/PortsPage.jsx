import React from 'react';
import RemoteSettingForm from 'routes/Settings/components/RemoteSettingForm';

const Entry = [
	'tcp_port',
	'udp_port',
	'tls_port',
	'preferred_port_mapper',
];

const PortsPage = props => (
	<div>
		<RemoteSettingForm
			{ ...props }
			keys={ Entry }
		/>
	</div>
);

export default PortsPage;