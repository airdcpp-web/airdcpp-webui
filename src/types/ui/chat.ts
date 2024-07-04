import { AddTempShareResponse } from 'services/api/ShareApi';
import { ActionListType, ActionDefinition, ModuleActions } from './actions';
import { SessionItemBase } from './sessions';
import { RefluxActionListType, RefluxActionType } from './reflux';

export interface ChatAPI extends RefluxActionListType<SessionItemBase> {
  sendChatMessage: RefluxActionType<SessionItemBase>;
  sendStatusMessage: RefluxActionType<SessionItemBase>;
  fetchMessages: RefluxActionType<SessionItemBase>;
}

export interface ChatActionList extends ActionListType<SessionItemBase> {
  clearChat: ActionDefinition<SessionItemBase>;
}

export type ChatActions = ModuleActions<SessionItemBase, void, ChatActionList>;

export type ChatFileUploadHandler = (file: File) => Promise<AddTempShareResponse>;

export interface ChatController {
  chatApi: ChatAPI;
  chatActions: ChatActions;
  handleFileUpload: ChatFileUploadHandler;
  session: SessionItemBase;
  hubUrl?: string;
}
