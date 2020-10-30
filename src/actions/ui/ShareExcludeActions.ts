
import SocketService from 'services/SocketService';

import ShareConstants from 'constants/ShareConstants';
import IconConstants from 'constants/IconConstants';

import History from 'utils/History';

import * as API from 'types/api';
import * as UI from 'types/ui';


const handleAdd: UI.ActionHandler<void> = ({ location }) => {
  History.push(`${location.pathname}/browse`);
};

const handleRemove: UI.ActionHandler<string> = ({ data: path }) => {
  return SocketService.post(ShareConstants.EXCLUDES_REMOVE_URL, { path });
};


const ShareExcludeCreateActions: UI.ActionListType<undefined> = {
  add: {
    displayName: 'Add path',
    access: API.AccessEnum.SETTINGS_EDIT, 
    icon: IconConstants.CREATE,
    handler: handleAdd,
  },
};

const ShareExcludeEditActions: UI.ActionListType<string> = {
  remove: { 
    displayName: 'Remove path',
    access: API.AccessEnum.SETTINGS_EDIT, 
    icon: IconConstants.REMOVE,
    confirmation: {
      content: 'Are you sure that you want to remove the excluded path {{item}}?',
      approveCaption: 'Remove path',
      rejectCaption: `Don't remove`,
    },
    handler: handleRemove,
  }, 
};

export default {
  create: {
    moduleId: UI.Modules.SETTINGS,
    subId: 'shareExclude',
    actions: ShareExcludeCreateActions,
  },
  edit: {
    moduleId: UI.Modules.SETTINGS,
    subId: 'shareExclude',
    actions: ShareExcludeEditActions,
  }
};
