declare namespace API {
  type HubConnectStateId = 'connecting' | 'connected' | 'password' | 'keyprint_mismatch' | 'disconnected' | 'redirect';

  interface HubConnectState {
    id: HubConnectStateId;
    str: string;
    data?: {
      hub_url?: string;
    }
  }

  interface Hub {
    id: number;
    hub_url: string;
    connect_state: HubConnectState;
    identity: {
      name: string;
      description: string;
    }
    share_profile: any;
    favorite_hub: number | null;
    message_counts: ChatMessageCounts;
    encryption: EncryptionInfo;
  }

  interface HubCounts {
    share_size: number;
    user_count: number;
  }
}