const MODULE_URL = 'settings/v0';

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


export default {
	MODULE_URL: MODULE_URL,

	ITEMS_GET_URL: MODULE_URL + '/items/get',
	ITEMS_SET_URL: MODULE_URL + '/items/set',
	ITEMS_RESET_URL: MODULE_URL + '/items/reset',
	ITEMS_INFO_URL: MODULE_URL + '/items/info',
}
;
