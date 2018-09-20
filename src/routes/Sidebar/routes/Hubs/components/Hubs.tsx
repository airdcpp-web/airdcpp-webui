import React from 'react';
import createReactClass from 'create-react-class';
//@ts-ignore
import Reflux from 'reflux';

import TextDecorator from 'components/TextDecorator';

import SessionLayout from 'routes/Sidebar/components/SessionLayout';

import HubSessionStore from 'stores/HubSessionStore';
import HubActions from 'actions/HubActions';

import { hubOnlineStatusToColor } from 'utils/TypeConvert';

import HubSession from 'routes/Sidebar/routes/Hubs/components/HubSession';
import HubNew from 'routes/Sidebar/routes/Hubs/components/HubNew';
import HubIcon from 'components/icon/HubIcon';


import * as API from 'types/api';
import * as UI from 'types/ui';


const ItemHandler: UI.SessionInfoGetter<API.Hub> = {
  itemNameGetter(session) {
    return session.identity.name;
  },

  itemStatusGetter(session) {
    return hubOnlineStatusToColor(session.connect_state.id);
  },

  itemHeaderDescriptionGetter(session) {
    return (
      <TextDecorator
        text={ session.identity.description }
        emojify={ true }
      />
    );
  },

  itemHeaderIconGetter(session) {
    return <HubIcon hub={ session } />;
  },
};

interface SessionRouteParams {
  id: string;
}

const parseNumericId = (params: SessionRouteParams) => {
  if (!params.id) {
    return null;
  }

  return parseInt(params['id']);
};

//const hubActions = [ 'reconnect', 'favorite', 'clear' ];

const Hubs = createReactClass({
  displayName: 'Hubs',
  mixins: [ Reflux.connect(HubSessionStore, 'hubSessions') ],

  render() {
    const { match, ...other } = this.props;
    return (
      <SessionLayout 
        activeId={ parseNumericId(match.params) }
        baseUrl="hubs"
        items={ this.state.hubSessions } 
        newCaption="Connect"
        newDescription="Connect to a new hub"
        newIcon="sitemap"
        editAccess={ API.AccessEnum.HUBS_EDIT }
        actions={ HubActions } 
        //actionIds={ hubActions }
        sessionLayout={ HubSession }
        newLayout={ HubNew }

        unreadInfoStore={ HubSessionStore }
        { ...ItemHandler }
        { ...other }
      />
    );
  },
});

export default Hubs;
