import { ChatMessageCounts, EncryptionInfo } from './common';

export type HubConnectStateEnum = 'connecting' | 'connected' | 'password' | 
  'keyprint_mismatch' | 'disconnected' | 'redirect';

export interface HubConnectState {
  id: HubConnectStateEnum;
  str: string;
  data?: {
    hub_url?: string;
  };
}

export interface Hub {
  id: number;
  hub_url: string;
  connect_state: HubConnectState;
  identity: {
    name: string;
    description: string;
  };
  share_profile: any;
  favorite_hub: number | null;
  message_counts: ChatMessageCounts;
  encryption: EncryptionInfo;
}

export interface HubCounts {
  share_size: number;
  user_count: number;
}