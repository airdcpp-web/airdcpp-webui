import React from 'react';
import ProtocolPage from './ProtocolPage';
import SettingPageMixin from 'routes/Settings/mixins/SettingPageMixin';

import t from 'utils/tcomb-form';

const Entry = {
	connection_auto_v4: t.Boolean,
	connection_bind_v4: t.Str,
	connection_mode_v4: t.Num,
	connection_ip_v4: t.maybe(t.Str),
};

const IPv4 = React.createClass({
	mixins: [ SettingPageMixin('form') ],
	render() {
		return (
			<div className="v4-settings">
				<ProtocolPage
					ref="form"
					formItems={Entry}
					protocol="v4"
				/>
			</div>
		);
	}
});

export default IPv4;