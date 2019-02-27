'use strict';
import HubConstants from 'constants/HubConstants';
import SocketService from 'services/SocketService';

//import History from 'utils/History';
//import NotificationActions from 'actions/NotificationActions';

import ChatActionDecorator from './decorators/ChatActionDecorator';
import SessionActionDecorator from './decorators/SessionActionDecorator';

import IconConstants from 'constants/IconConstants';

import * as API from 'types/api';
import * as UI from 'types/ui';
//import { ErrorResponse } from 'airdcpp-apisocket';
//import { Location } from 'history';


const showFav = (hub: API.Hub) => !hub.favorite_hub;


const handleFavorite: UI.ActionHandler<API.Hub> = ({ data: hub }) => {
  SocketService.post(`${HubConstants.SESSIONS_URL}/${hub.id}/favorite`);
};

/*const handleFavorite = (hub: API.Hub) => {
  NotificationActions.success({ 
    title: hub.identity.name,
    message: 'The hub has been added in favorites',
  });		
};

HubActions.favorite.failed.listen(function (hub: API.Hub, error: ErrorResponse) {
  NotificationActions.error({ 
    title: hub.identity.name,
    message: error.message,
  });		
});*/

const handleReconnect: UI.ActionHandler<API.Hub> = ({ data: hub }) => {
  SocketService.post(`${HubConstants.SESSIONS_URL}/${hub.id}/reconnect`);
};

const HubActions: UI.ActionListType<API.Hub> = {
  reconnect: { 
    displayName: 'Reconnect',
    access: API.AccessEnum.HUBS_EDIT, 
    icon: IconConstants.REFRESH,
    handler: handleReconnect,
  },
  favorite: { 
    access: API.AccessEnum.HUBS_EDIT, 
    displayName: 'Add to favorites', 
    icon: IconConstants.FAVORITE,
    filter: showFav,
    handler: handleFavorite,
  },
};


const HubActionsDecorated = SessionActionDecorator(
  ChatActionDecorator(
    HubActions, 
    HubConstants.SESSIONS_URL, 
    API.AccessEnum.HUBS_EDIT
  ), 
  HubConstants.SESSIONS_URL, 
  API.AccessEnum.HUBS_EDIT
);

export default {
  moduleId: UI.Modules.HUBS,
  actions: HubActionsDecorated,
};
