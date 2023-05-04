//import PropTypes from 'prop-types';
import * as React from 'react';

import RouterMenuItemLink from 'components/semantic/RouterMenuItemLink';

import * as UI from 'types/ui';

interface SessionMenuItemProps {
  url: string;
  name: React.ReactNode;
  unreadInfoStore: UI.UnreadInfoStore;
  status: React.ReactElement<any>;
  sessionItem: UI.SessionItemBase;
}

const SessionMenuItem: React.FC<SessionMenuItemProps> = ({
  sessionItem,
  status,
  name,
  unreadInfoStore,
  url,
}) => (
  <RouterMenuItemLink
    url={url}
    className="session-item"
    icon={status}
    session={sessionItem}
    unreadInfoStore={unreadInfoStore}
  >
    <span className="session-name">{name}</span>
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
