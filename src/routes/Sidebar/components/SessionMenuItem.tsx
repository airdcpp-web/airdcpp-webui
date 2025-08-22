import * as React from 'react';

import RouterMenuItemLink, {
  RouterMenuItemLinkProps,
} from '@/components/semantic/RouterMenuItemLink';

import * as UI from '@/types/ui';

export interface SessionMenuItemProps extends Partial<RouterMenuItemLinkProps> {
  url: string;
  name: string;
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
  ...other
}) => (
  <RouterMenuItemLink
    url={url}
    className="session-item"
    icon={status}
    sessionItem={sessionItem}
    unreadInfoStoreSelector={unreadInfoStoreSelector}
    aria-label={name}
    {...other}
  >
    {name}
  </RouterMenuItemLink>
);

export default SessionMenuItem;
