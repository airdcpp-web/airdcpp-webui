const MODULE_URL = 'settings';

export const SettingProfileEnum = {
	NORMAL: 0, 
	RAR: 1, 
	LAN: 2
};

export const ConnectionModeEnum = {
	INCOMING_DISABLED: -1, 
	INCOMING_ACTIVE: 0, 
	INCOMING_ACTIVE_UPNP: 1,
	INCOMING_PASSIVE: 2,
};

export const LocalSettings = {
	NOTIFY_PM_USER: 'notify_pm_user',
	NOTIFY_PM_BOT: 'notify_pm_bot',
	NOTIFY_BUNDLE_STATUS: 'notify_bundle_status',

	NOTIFY_EVENTS_INFO: 'notify_events_info',
	NOTIFY_EVENTS_WARNING: 'notify_events_warning',
	NOTIFY_EVENTS_ERROR: 'notify_events_error',
	
	UNREAD_LABEL_DELAY: 'unread_label_delay',
};

export default {
	MODULE_URL: MODULE_URL,

	ITEMS_GET_URL: MODULE_URL + '/get',
	ITEMS_SET_URL: MODULE_URL + '/set',
	ITEMS_RESET_URL: MODULE_URL + '/reset',
	ITEMS_INFO_URL: MODULE_URL + '/infos',
}
;
