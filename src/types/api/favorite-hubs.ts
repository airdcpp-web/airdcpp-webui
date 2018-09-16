import { ConnectivityModeEnum } from './settings';
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
}

export const enum FavoriteHubConnectStateId {
  CONNECTED = 'connected',
  CONNECTING = 'connecting',
  DISCONNECTED = 'disconnected',
}

export interface FavoriteHubConnectState {
  id: FavoriteHubConnectStateId;
  str: string;
  current_hub_id: number;
}

export type FavoriteHubEntry = FavoriteHubEntryBase & {
  id: number;
  connect_state: FavoriteHubConnectState;
  share_profile?: ShareProfileBasic;
  has_password: boolean;
};
