import React from 'react';
import ProtocolPage from './ProtocolPage';
import SettingPageMixin from 'routes/Settings/mixins/SettingPageMixin';

import t from 'utils/tcomb-form';

const Entry = {
	connection_auto_v6: t.Boolean,
	connection_bind_v6: t.Str,
	connection_mode_v6: t.Num,
	connection_ip_v6: t.maybe(t.Str),
	connection_update_ip_v6: t.Boolean,
	connection_ip_override_v6: t.Boolean,
};

const IPv6 = React.createClass({
	mixins: [ SettingPageMixin('form') ],
	render() {
		return (
			<div className="v6-settings">
				<ProtocolPage
					ref="form"
					formItems={Entry}
					protocol="v6"
				/>
			</div>
		);
	}
});

export default IPv6;