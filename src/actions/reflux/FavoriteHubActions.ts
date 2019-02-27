'use strict';
//@ts-ignore
import Reflux from 'reflux';

import SocketService from 'services/SocketService';

import FavoriteHubConstants from 'constants/FavoriteHubConstants';

import * as API from 'types/api';
import * as UI from 'types/ui';


const FavoriteHubActionConfig: UI.RefluxActionConfigList<API.FavoriteHubEntry> = [
  { 'update': { 
    asyncResult: true
  } },
];

export const FavoriteHubActions = Reflux.createActions(FavoriteHubActionConfig);


FavoriteHubActions.update.listen(function (
  this: UI.AsyncActionType<API.FavoriteHubEntry>, 
  hub: API.FavoriteHubEntry, 
  data: Partial<API.FavoriteHubEntryBase>
) {
  let that = this;
  return SocketService.patch(FavoriteHubConstants.HUBS_URL + '/' + hub.id, data)
    .then(that.completed)
    .catch(this.failed);
});


export default FavoriteHubActions as UI.RefluxActionListType<API.FavoriteHubEntry>;
