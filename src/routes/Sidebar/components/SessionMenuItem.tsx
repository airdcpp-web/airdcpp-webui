//import PropTypes from 'prop-types';
import React from 'react';

import RouterMenuItemLink from 'components/semantic/RouterMenuItemLink';

import * as API from 'types/api';
import * as UI from 'types/ui';


type PushSessionHandler = (id: API.IdType) => void;

const onClickItem = (
  evt: React.SyntheticEvent, 
  sessionItem: UI.SessionItemBase, 
  pushSession: PushSessionHandler
) => {
  evt.preventDefault();

  pushSession(sessionItem.id);
};

interface SessionMenuItemProps {
  url: string;
  name: React.ReactNode;
  unreadInfoStore: any;
  status: React.ReactElement<any>;
  sessionItem: UI.SessionItemBase;

  pushSession: PushSessionHandler;
}

const SessionMenuItem: React.FC<SessionMenuItemProps> = (
  { sessionItem, status, name, unreadInfoStore, url, pushSession }
) => (
  <RouterMenuItemLink 
    url={ url } 
    className="session-item" 
    onClick={ (evt: React.SyntheticEvent) => onClickItem(evt, sessionItem, pushSession) }
    icon={ status }
    session={ sessionItem }
    unreadInfoStore={ unreadInfoStore }
  >
    <span className="session-name">
      { name }
    </span>
  </RouterMenuItemLink>
);

/*SessionMenuItem.propTypes = {
  // Item URL
  url: PropTypes.string.isRequired,

  name: PropTypes.node.isRequired,

  unreadInfoStore: PropTypes.object.isRequired,

  status: PropTypes.node.isRequired,

  sessionItem: PropTypes.object.isRequired,

  pushSession: PropTypes.func.isRequired,
};*/

export default SessionMenuItem;