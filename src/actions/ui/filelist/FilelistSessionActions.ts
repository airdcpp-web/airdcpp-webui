import FilelistConstants from '@/constants/FilelistConstants';

import * as API from '@/types/api';
import * as UI from '@/types/ui';
import { BuildRemoveSessionAction } from '../decorators/SessionActionDecorator';

const FilelistRemoveAction = BuildRemoveSessionAction(
  FilelistConstants.SESSIONS_URL,
  API.AccessEnum.FILELISTS_EDIT,
);

const FilelistSessionActions: UI.ActionListType<API.FilelistSession> = {
  remove: FilelistRemoveAction,
};

export const FilelistSessionActionModule = {
  moduleId: UI.Modules.FILELISTS,
};

export const FilelistSessionActionMenu = {
  moduleData: FilelistSessionActionModule,
  actions: FilelistSessionActions,
};
