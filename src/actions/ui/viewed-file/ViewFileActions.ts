import ViewFileConstants from 'constants/ViewFileConstants';

import { BuildRemoveSessionAction } from '../decorators/SessionActionDecorator';

import * as API from 'types/api';
import * as UI from 'types/ui';

const ViewFileRemoveAction = BuildRemoveSessionAction(
  ViewFileConstants.SESSIONS_URL,
  API.AccessEnum.VIEW_FILE_EDIT,
);

const ViewFileActions: UI.ActionListType<API.ViewFile> = {
  remove: ViewFileRemoveAction,
};

const ViewFileActionModule = {
  moduleId: UI.Modules.VIEWED_FILES,
};

export const ViewFileActionMenu = {
  moduleData: ViewFileActionModule,
  actions: ViewFileActions,
};
