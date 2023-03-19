import { ChatMessageCounts, EncryptionInfo, HintedUser } from './common';

export const enum CCPMStateEnum {
  CONNECTED = 'connected',
  CONNECTING = 'connecting',
  DISCONNECTED = 'disconnected',
}

export interface CCPMState {
  id: CCPMStateEnum;
  str: string;
  encryption?: EncryptionInfo;
}

export interface PrivateChat {
  id: string;
  user: HintedUser;
  ccpm_state: CCPMState;
  message_counts: ChatMessageCounts;
}
