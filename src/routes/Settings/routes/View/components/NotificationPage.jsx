import React from 'react';

import { LocalSettings } from 'constants/SettingConstants';
import LocalSettingForm from 'routes/Settings/components/LocalSettingForm';

import '../style.css';


const PopupEntry = [
	LocalSettings.NOTIFY_PM_USER,
	LocalSettings.NOTIFY_PM_BOT,
	LocalSettings.NOTIFY_BUNDLE_STATUS,

	LocalSettings.NOTIFY_EVENTS_INFO,
	LocalSettings.NOTIFY_EVENTS_WARNING,
	LocalSettings.NOTIFY_EVENTS_ERROR,
];

const NotificationPage = props => (
	<div>
		<LocalSettingForm
			title="Popup notifications"
			{ ...props }
			keys={ PopupEntry }
		/>
	</div>
);

export default NotificationPage;