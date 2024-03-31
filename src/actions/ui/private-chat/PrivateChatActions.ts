import PrivateChatConstants from 'constants/PrivateChatConstants';

import * as API from 'types/api';
import * as UI from 'types/ui';
import { BuildRemoveSessionAction } from '../decorators/SessionActionDecorator';
import { BuildClearChatAction } from '../decorators/ChatActionDecorator';

const PrivateChatClearChatAction = BuildClearChatAction(
  PrivateChatConstants.SESSIONS_URL,
  API.AccessEnum.PRIVATE_CHAT_EDIT,
);

const PrivateChatRemoveAction = BuildRemoveSessionAction(
  PrivateChatConstants.SESSIONS_URL,
  API.AccessEnum.PRIVATE_CHAT_EDIT,
);

const PrivateChatActions: UI.ActionListType<API.PrivateChat> = {
  clearChat: PrivateChatClearChatAction,
  remove: PrivateChatRemoveAction,
};

export const PrivateChatActionModule = {
  moduleId: UI.Modules.MESSAGES,
};

export const PrivateChatActionMenu = {
  moduleData: PrivateChatActionModule,
  actions: PrivateChatActions,
};
