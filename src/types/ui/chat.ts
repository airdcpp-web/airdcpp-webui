import { AddTempShareResponse } from 'services/api/ShareApi';
import {
  ActionListType,
  ActionType,
  ModuleActions,
  RefluxActionListType,
  RefluxActionType,
} from './actions';
import { SessionItemBase } from './sessions';

export interface ChatAPI extends RefluxActionListType<SessionItemBase> {
  sendChatMessage: RefluxActionType<SessionItemBase>;
  sendStatusMessage: RefluxActionType<SessionItemBase>;
  fetchMessages: RefluxActionType<SessionItemBase>;
}

export interface ChatActionList extends ActionListType<SessionItemBase> {
  clear: ActionType<SessionItemBase>;
}

export type ChatActions = ModuleActions<SessionItemBase, ChatActionList>;

export type ChatFileUploadHandler = (file: File) => Promise<AddTempShareResponse>;

export interface ChatController {
  chatApi: ChatAPI;
  chatActions: ChatActions;
  handleFileUpload: ChatFileUploadHandler;
  session: SessionItemBase;
  hubUrl?: string;
}
