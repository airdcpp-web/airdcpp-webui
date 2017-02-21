import React from 'react';

import { LocalSettings } from 'constants/SettingConstants';
import LocalSettingForm from 'routes/Settings/components/LocalSettingForm';
import SettingPageMixin from 'routes/Settings/mixins/SettingPageMixin';

import t from 'utils/tcomb-form';

import '../style.css';


const PopupEntry = {
	[LocalSettings.NOTIFY_PM_USER]: t.Bool,
	[LocalSettings.NOTIFY_PM_BOT]: t.Bool,
	[LocalSettings.NOTIFY_BUNDLE_STATUS]: t.Bool,

	[LocalSettings.NOTIFY_EVENTS_INFO]: t.Bool,
	[LocalSettings.NOTIFY_EVENTS_WARNING]: t.Bool,
	[LocalSettings.NOTIFY_EVENTS_ERROR]: t.Bool,
};

const NotificationPage = React.createClass({
	mixins: [ SettingPageMixin('popups') ],
	render() {
		return (
			<div>
				<LocalSettingForm
					title="Popup notifications"
					ref="popups"
					formItems={ PopupEntry }
				/>
			</div>
		);
	}
});

export default NotificationPage;