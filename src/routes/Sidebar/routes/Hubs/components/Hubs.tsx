import React from 'react';

import TextDecorator from 'components/TextDecorator';

import SessionLayout from 'routes/Sidebar/components/SessionLayout';

import HubSessionStore from 'stores/HubSessionStore';
import HubUIActions from 'actions/ui/HubActions';
import HubAPIActions from 'actions/reflux/HubActions';

import { hubOnlineStatusToColor } from 'utils/TypeConvert';

import HubSession from 'routes/Sidebar/routes/Hubs/components/HubSession';
import HubNew from 'routes/Sidebar/routes/Hubs/components/HubNew';
import HubIcon from 'components/icon/HubIcon';


import * as API from 'types/api';
import * as UI from 'types/ui';
import { 
  SessionProviderDecorator, SessionProviderDecoratorChildProps 
} from 'routes/Sidebar/decorators/SessionProviderDecorator';
import { toI18nKey } from 'utils/TranslationUtils';
import IconConstants from 'constants/IconConstants';


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

const parseNumericId = (params: UI.SessionRouteParams) => {
  if (!params.id) {
    return null;
  }

  return parseInt(params['id']);
};

//const hubActions = [ 'reconnect', 'favorite', 'clear' ];

const Hubs: React.FC<SessionProviderDecoratorChildProps<API.Hub>> = props => {
  const { match, t, ...other } = props;
  return (
    <SessionLayout 
      activeId={ parseNumericId(match.params) }
      baseUrl="hubs"
      newCaption={ t(toI18nKey('new', UI.Modules.HUBS), 'Connect') }
      newDescription={ t(toI18nKey('newDesc', UI.Modules.HUBS), 'Connect to a new hub') } 
      newIcon={ IconConstants.HUB }
      editAccess={ API.AccessEnum.HUBS_EDIT }
      uiActions={ HubUIActions }
      sessionApi={ HubAPIActions as UI.SessionActions<API.Hub> }
      sessionItemLayout={ HubSession }
      newLayout={ HubNew }
      t={ t }
      unreadInfoStore={ HubSessionStore }
      { ...ItemHandler }
      { ...other }
    />
  );
};

export default SessionProviderDecorator(Hubs, HubSessionStore);
