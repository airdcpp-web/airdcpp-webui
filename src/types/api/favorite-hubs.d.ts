declare namespace API {
  export interface FavoriteHubEntryBase extends Partial<UI.FormValueMap> {
    name: string;
    hub_url: string;
    hub_description?: string;
    auto_connect: boolean;
    nick?: string;
    user_description?: string;
    nmdc_encoding?: string;
    connection_mode_v4?: ConnectivityModeEnum;
    connection_mode_v6?: ConnectivityModeEnum;
    connection_ip_v4?: string;
    connection_ip_v6?: string;
  }

  export enum FavoriteHubConnectStateId {
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
  }
}