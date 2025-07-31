import * as React from 'react';

import RouterMenuItemLink from '@/components/semantic/RouterMenuItemLink';

import * as UI from '@/types/ui';

interface SessionMenuItemProps {
  url: string;
  name: React.ReactNode;
  unreadInfoStoreSelector: UI.SessionStoreSelector;
  status: React.ReactElement<any>;
  sessionItem: UI.SessionItemBase;
}

const SessionMenuItem: React.FC<SessionMenuItemProps> = ({
  sessionItem,
  status,
  name,
  unreadInfoStoreSelector,
  url,
}) => (
  <RouterMenuItemLink
    url={url}
    className="session-item"
    icon={status}
    sessionItem={sessionItem}
    unreadInfoStoreSelector={unreadInfoStoreSelector}
  >
    <span className="session-name">{name}</span>
  </RouterMenuItemLink>
);

export default SessionMenuItem;
