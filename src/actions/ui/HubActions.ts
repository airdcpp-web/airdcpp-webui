'use strict';
import HubConstants from 'constants/HubConstants';
import SocketService from 'services/SocketService';

import ChatActionDecorator from './decorators/ChatActionDecorator';
import SessionActionDecorator from './decorators/SessionActionDecorator';

import IconConstants from 'constants/IconConstants';

import * as API from 'types/api';
import * as UI from 'types/ui';


const showFav = (hub: API.Hub) => !hub.favorite_hub;


const handleFavorite: UI.ActionHandler<API.Hub> = ({ data: hub }) => {
  return SocketService.post(`${HubConstants.SESSIONS_URL}/${hub.id}/favorite`);
};

const handleReconnect: UI.ActionHandler<API.Hub> = ({ data: hub }) => {
  return SocketService.post(`${HubConstants.SESSIONS_URL}/${hub.id}/reconnect`);
};

const HubActions: UI.ActionListType<API.Hub> = {
  reconnect: { 
    displayName: 'Reconnect',
    access: API.AccessEnum.HUBS_EDIT, 
    icon: IconConstants.REFRESH_COLORED,
    handler: handleReconnect,
  },
  favorite: { 
    access: API.AccessEnum.HUBS_EDIT, 
    displayName: 'Add to favorites', 
    icon: IconConstants.FAVORITE,
    filter: showFav,
    handler: handleFavorite,
    notifications: {
      onSuccess: 'The hub {{item.identity.name}} was added in favorites',
    }
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
