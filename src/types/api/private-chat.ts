import { ChatMessageCounts, EncryptionInfo, HintedUser } from './common';

export type CCPMStateId = 'connected' | 'connecting' | 'disconnected';

export interface CCPMState {
  id: CCPMStateId;
  str: string;
  encryption?: EncryptionInfo;
}

export interface PrivateChat {
  id: string;
  user: HintedUser;
  ccpm_state: CCPMState;
  message_counts: ChatMessageCounts;
}