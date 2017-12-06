import React from 'react';
import createReactClass from 'create-react-class';
import Reflux from 'reflux';
import { Route } from 'react-router';

import TextDecorator from 'components/TextDecorator';

import SessionLayout from 'routes/Sidebar/components/SessionLayout';

import HubSessionStore from 'stores/HubSessionStore';
import HubActions from 'actions/HubActions';

import TypeConvert from 'utils/TypeConvert';
import AccessConstants from 'constants/AccessConstants';

import HubSession from './HubSession';
import HubNew from './HubNew';
import HubIcon from 'components/icon/HubIcon';


const ItemHandler = {
  itemNameGetter(session) {
    return session.identity.name;
  },

  itemStatusGetter(session) {
    return TypeConvert.hubOnlineStatusToColor(session.connect_state.id);
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

const parseNumericId = (params) => {
  if (!params['id']) {
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
        editAccess={ AccessConstants.HUBS_EDIT }
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
