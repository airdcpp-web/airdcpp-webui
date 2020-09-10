import { ConnectivityModeEnum } from './connectivity';
import { ShareProfileBasic } from './shareprofiles';

export interface FavoriteHubEntryBase {
  name: string;
  hub_url: string;
  hub_description: string | null;
  auto_connect: boolean;
  nick: string | null;
  user_description: string | null;
  nmdc_encoding: string | null;
  connection_mode_v4: ConnectivityModeEnum | null;
  connection_mode_v6: ConnectivityModeEnum | null;
  connection_ip_v4: string | null;
  connection_ip_v6: string | null;
  show_joins: boolean | null;
  fav_show_joins: boolean | null;
  use_main_chat_notify: boolean | null;
  away_message: string | null;
}

/*export const enum FavoriteHubConnectStateEnum {
  DISCONNECTED = 'disconnected',
  CONNECTING = 'connecting',
  CONNECTED = 'connected',
}*/

// TODO: fix in the next API version
export const enum FavoriteHubConnectStateEnum {
  DISCONNECTED = 0,
  CONNECTING = 1,
  CONNECTED = 2,
}

export interface FavoriteHubConnectState {
  id: FavoriteHubConnectStateEnum;
  str: string;
  current_hub_id: number;
}

export type FavoriteHubEntry = FavoriteHubEntryBase & {
  id: number;
  connect_state: FavoriteHubConnectState;
  share_profile?: ShareProfileBasic;
  has_password: boolean;
};
