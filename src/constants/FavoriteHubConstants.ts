const MODULE_URL = 'favorite_hubs';

/*export enum ConnectStateEnum {
  DISCONNECTED = 'disconnected',
  CONNECTING = 'connecting',
  CONNECTED = 'connected'
};*/

export enum ConnectStateEnum {
  DISCONNECTED = 0,
  CONNECTING = 1,
  CONNECTED = 2
}

export default {
  MODULE_URL: MODULE_URL,
  HUBS_URL: MODULE_URL,
};
