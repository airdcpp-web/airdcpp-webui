declare namespace API {
  type CCPMStateId = 'connected' | 'connecting' | 'disconnected';

  interface CCPMState {
    id: CCPMStateId;
    str: string;
    encryption?: EncryptionInfo;
  }

  interface PrivateChat {
    id: string;
    user: HintedUser;
    ccpm_state: CCPMState;
    message_counts: ChatMessageCounts;
  }
}