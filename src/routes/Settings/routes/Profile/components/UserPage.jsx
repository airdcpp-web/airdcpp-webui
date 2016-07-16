import React from 'react';
import { SettingProfileEnum } from 'constants/SettingConstants';
import SettingForm from 'routes/Settings/components/SettingForm';
import SettingPageMixin from 'routes/Settings/mixins/SettingPageMixin';

import t from 'utils/tcomb-form';

const Entry = {
	nick: t.maybe(t.Str),
	description: t.maybe(t.Str),
	email: t.maybe(t.Str),
	setting_profile: t.Num,
};

const UserPage = React.createClass({
	mixins: [ SettingPageMixin('form') ],
	onFieldSetting(id, fieldOptions, formValue) {
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
	},

	render() {
		return (
			<div>
				<SettingForm
					ref="form"
					formItems={Entry}
					onFieldSetting={this.onFieldSetting}
				/>
			</div>
		);
	}
});

export default UserPage;