import React from 'react';
import { SettingProfileEnum } from 'constants/SettingConstants';
import RemoteSettingForm from 'routes/Settings/components/RemoteSettingForm';

const Entry = [
	'nick',
	'description',
	'email',
	'setting_profile',
];

const onFieldSetting = (id, fieldOptions, formValue) => {
	if (id === 'setting_profile') {
		switch (formValue[id]) {
			case SettingProfileEnum.NORMAL: {
				fieldOptions['help'] = 'The client is used in normal private/public hubs for transferring files via internet. Use this profile if unsure.';
				break;
			}
			case SettingProfileEnum.RAR: {
				fieldOptions['help'] = 'The client is used for transferring files that are split in RAR archives (or in other small-sized formats)';
				break;
			}
			case SettingProfileEnum.LAN: {
				fieldOptions['help'] = 'The client is used for transferring files in local network (e.g. LAN parties) or in another closed network (e.g. university network)';
				break;
			}
		}
	}
};

const UserPage = props => (
	<div>
		<RemoteSettingForm
			{ ...props }
			keys={ Entry }
			onFieldSetting={ onFieldSetting }
		/>
	</div>
);

export default UserPage;