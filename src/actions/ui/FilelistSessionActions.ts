import FilelistConstants from 'constants/FilelistConstants';

import SessionActionDecorator from './decorators/SessionActionDecorator';

import * as API from 'types/api';
import * as UI from 'types/ui';

const FilelistSessionActions: UI.ActionListType<API.FilelistSession> = {};

const FilelistSessionActionsDecorated = SessionActionDecorator(
  FilelistSessionActions,
  FilelistConstants.SESSIONS_URL,
  API.AccessEnum.FILELISTS_EDIT
);

export default {
  moduleId: UI.Modules.FILELISTS,
  actions: FilelistSessionActionsDecorated,
};
