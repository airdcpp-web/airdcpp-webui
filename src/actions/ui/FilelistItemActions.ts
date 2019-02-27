'use strict';

import FilelistConstants from 'constants/FilelistConstants';

import ShareActions from 'actions/reflux/ShareActions';
import SocketService from 'services/SocketService';

import IconConstants from 'constants/IconConstants';

import * as API from 'types/api';
import * as UI from 'types/ui';


interface ActionFilelistItemData {
  item: API.FilelistItem;
  session: API.FilelistSession;
}


const isMe = ({ session }: ActionFilelistItemData) => session.user.flags.indexOf('self') !== -1;
const isPartialList = ({ session }: ActionFilelistItemData) => session.partial_list;


const handleReloadDirectory: UI.ActionHandler<ActionFilelistItemData> = (
  { data } 
) => {
  const { session, item } = data;

  SocketService.post(`${FilelistConstants.SESSIONS_URL}/${session.id}/directory`, { 
    list_path: item.path,
    reload: true,
  });
};

const handleRefreshShare: UI.ActionHandler<ActionFilelistItemData> = ({ data }) => {
  ShareActions.refreshVirtual(data.item.path, data.session.share_profile!.id);
};

const FilelistItemActions: UI.ActionListType<ActionFilelistItemData> = {
  reloadDirectory: {
    displayName: 'Reload',
    access: API.AccessEnum.FILELISTS_VIEW,
    icon: IconConstants.RELOAD,
    filter: isPartialList,
    handler: handleReloadDirectory,
  },
  refreshShare: {
    displayName: 'Refresh in share',
    access: API.AccessEnum.SETTINGS_EDIT,
    icon: IconConstants.REFRESH,
    filter: isMe,
    handler: handleRefreshShare,
  },
};

export default {
  moduleId: UI.Modules.FILELISTS,
  subId: 'item',
  actions: FilelistItemActions,
};
