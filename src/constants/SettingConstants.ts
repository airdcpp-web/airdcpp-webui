const MODULE_URL = 'settings';

export const enum SettingProfileEnum {
  NORMAL = 0,
  RAR = 1,
  LAN = 2,
}

export const enum IncomingConnectionModeEnum {
  INCOMING_DISABLED = -1,
  INCOMING_ACTIVE = 0,
  INCOMING_ACTIVE_UPNP = 1,
  INCOMING_PASSIVE = 2,
}

export const enum OutgoingConnectionModeEnum {
  OUTGOING_DIRECT = 0,
  OUTGOING_SOCKS = 1,
}

export default {
  MODULE_URL: MODULE_URL,

  ITEMS_GET_URL: MODULE_URL + '/get',
  ITEMS_SET_URL: MODULE_URL + '/set',
  ITEMS_RESET_URL: MODULE_URL + '/reset',
  ITEMS_DEFINITIONS_URL: MODULE_URL + '/definitions',
};
