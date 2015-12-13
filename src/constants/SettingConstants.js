const SETTING_MODULE_URL = 'settings/v0';

export const SettingProfileEnum = {
	PROFILE_NORMAL: 0, 
	PROFILE_RAR: 1, 
	PROFILE_LAN: 2
};

export const ConnectionModeEnum = {
	INCOMING_DISABLED: -1, 
	INCOMING_ACTIVE: 0, 
	INCOMING_ACTIVE_UPNP: 1,
	INCOMING_PASSIVE: 2,
};


export default {
	SETTING_MODULE_URL: SETTING_MODULE_URL,

	ITEMS_GET_URL: SETTING_MODULE_URL + '/items/get',
	ITEMS_SET_URL: SETTING_MODULE_URL + '/items/set',
	ITEMS_RESET_URL: SETTING_MODULE_URL + '/items/reset',
	ITEMS_INFO_URL: SETTING_MODULE_URL + '/items/info',
}
;
