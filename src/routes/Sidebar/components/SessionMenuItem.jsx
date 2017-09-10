import PropTypes from 'prop-types';
import React from 'react';

import { RouterMenuItemLink } from 'components/semantic/MenuItem';


const onClickItem = (evt, sessionItem, pushSession) => {
  evt.preventDefault();

  pushSession(sessionItem.id);
};

const SessionMenuItem = ({ sessionItem, status, name, unreadInfoStore, url, pushSession }) => (
  <RouterMenuItemLink 
    url={ url } 
    className="session-item" 
    onClick={ evt => onClickItem(evt, sessionItem, pushSession) }
    icon={ status }
    session={ sessionItem }
    unreadInfoStore={ unreadInfoStore }
  >
    <span className="session-name">
      { name }
    </span>
  </RouterMenuItemLink>
);

SessionMenuItem.propTypes = {
  /**
	 * Item URL
	 */
  url: PropTypes.string.isRequired,

  name: PropTypes.node.isRequired,

  unreadInfoStore: PropTypes.object.isRequired,

  status: PropTypes.node.isRequired,

  sessionItem: PropTypes.object.isRequired,

  pushSession: PropTypes.func.isRequired,
};

export default SessionMenuItem;