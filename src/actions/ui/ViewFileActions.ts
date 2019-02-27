'use strict';
import ViewFileConstants from 'constants/ViewFileConstants';

import SessionActionDecorator from './decorators/SessionActionDecorator';

import * as API from 'types/api';
import * as UI from 'types/ui';


const ViewFileActions: UI.ActionListType<API.ViewFile> = {};

const ViewFileActionsDecorated = SessionActionDecorator(
  ViewFileActions, 
  ViewFileConstants.SESSIONS_URL, 
  API.AccessEnum.VIEW_FILE_EDIT
);

export default {
  moduleId: UI.Modules.VIEWED_FILES,
  actions: ViewFileActionsDecorated,
};
