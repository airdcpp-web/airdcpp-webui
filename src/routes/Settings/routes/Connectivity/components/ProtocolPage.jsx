import React from 'react';
//import SocketService from 'services/SocketService';
import SettingForm from 'routes/Settings/components/SettingForm';

import { ConnectionModeEnum } from 'constants/SettingConstants';
//import t from 'utils/tcomb-form';

const ProtocolPage = React.createClass({
	convertValue(key) {
		return key + '_' + this.props.protocol;
	},

	onFieldSetting(id, fieldOptions, fieldValue, formValue) {
		const protocolEnabled = formValue[this.convertValue('connection_mode')] !== ConnectionModeEnum.INCOMING_DISABLED;
		const autoDetect = formValue[this.convertValue('connection_auto')];

		if ((!protocolEnabled || autoDetect) && (id.indexOf('connection_ip') === 0 || id.indexOf('connection_bind') === 0 || id.indexOf('connection_mode') === 0)) {
			fieldOptions['disabled'] = true;
		}
	},

	render() {
		return (
			<div className="detection-settings">
				<SettingForm
					formItems={this.props.formItems}
					onFieldSetting={this.onFieldSetting}
				/>
			</div>
		);
	}
});

export default ProtocolPage;