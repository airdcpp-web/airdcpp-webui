import React from 'react';
import { SettingProfileEnum } from 'constants/SettingConstants';
//import SocketService from 'services/SocketService';
import SettingForm from 'routes/Settings/components/SettingForm';

import t from 'utils/tcomb-form';

const Entry = {
	nick: t.maybe(t.Str),
	description: t.maybe(t.Str),
	email: t.maybe(t.Str),
	setting_profile: t.Num,
};

const Personal = React.createClass({
	onFieldSetting(id, fieldOptions, currentValue) {
		if (id === 'setting_profile') {
			switch (currentValue) {
				case SettingProfileEnum.PROFILE_NORMAL: {
					fieldOptions['help'] = 'The client is used in normal private/public hubs for transferring files via internet. Use this profile if unsure.';
					break;
				}
				case SettingProfileEnum.PROFILE_RAR: {
					fieldOptions['help'] = 'The client is used for transferring files that are split in RAR archives (or in other small-sized formats)';
					break;
				}
				case SettingProfileEnum.PROFILE_LAN: {
					fieldOptions['help'] = 'The client is used for transferring files in local network (e.g. LAN parties) or in another closed network (e.g. university network)';
					break;
				}
			}
		}
	},

	render() {
		return (
			<div className="personal-settings">
				<SettingForm
					formItems={Entry}
					onFieldSetting={this.onFieldSetting}
				/>
			</div>
		);
	}
});

export default Personal;