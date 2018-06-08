declare namespace API {
  type HubConnectState = 'connecting' | 'connected' | 'password' | 'keyprint_mismatch' | 'disconnected' | 'redirect';

  interface Hub {
    id: number;
    hub_url: string;
    connect_state: {
      id: HubConnectState;
      str: string;
      data?: {
        hub_url?: string;
      }
    }
    identity: {
      name: string;
      description: string;
    }
    share_profile: any;
    favorite_hub: number | null;
    message_counts: ChatMessageCounts;
    encryption: EncryptionInfo;
  }
}