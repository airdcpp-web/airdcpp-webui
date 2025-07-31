import { AddTempShareResponse } from '@/services/api/ShareApi';
import { SessionItemBase, SessionType } from './sessions';

import * as API from '@/types/api';
import * as UI from '@/types/ui';

import { APISocket } from '@/services/SocketService';
import { MessageSlice } from './session-store';
import { SessionAPIActions } from './session-layout';
import { ActionHandlerProps } from './actions';

export interface ChatAPIActions {
  sendChatMessage: (
    socket: APISocket,
    chatSession: SessionItemBase,
    text: string,
    thirdPerson?: boolean,
  ) => void;
  sendStatusMessage: (
    socket: APISocket,
    chatSession: SessionItemBase,
    message: API.OutgoingChatStatusMessage,
  ) => void;
  fetchMessages: (
    socket: APISocket,
    chatSession: SessionItemBase,
    messageStore: MessageSlice,
  ) => void;
}

export type ChatFileUploadHandler = (file: File) => Promise<AddTempShareResponse>;

// Chat commands
export interface ChatCommandProps extends ActionHandlerProps {
  session: UI.AuthenticatedSession;
}

export type ChatCommandParam = string | undefined;
export type ChatCommandHandler = (
  params: ChatCommandParam,
  chatController: ChatController,
  props: ChatCommandProps,
) => void;

export interface ChatCommand {
  help: string;
  handler: ChatCommandHandler;
  access?: API.AccessEnum;
}

export type ChatCommandList = { [key in string]: ChatCommand };

export interface ChatController {
  chatApi: ChatAPIActions & SessionAPIActions<SessionItemBase>;
  chatCommands: ChatCommandList;
  handleFileUpload: ChatFileUploadHandler;
  chatSession: SessionType;
  hubUrl?: string;
}
