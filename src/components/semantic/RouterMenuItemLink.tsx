import { memo } from 'react';
import * as React from 'react';

import classNames from 'classnames';

import { NavLink } from 'react-router';
import CountLabel from '@/components/CountLabel';
import Icon, { IconType } from '@/components/semantic/Icon';

import * as UI from '@/types/ui';

import { useSessionStoreProperty } from '@/context/SessionStoreContext';

type RouterMenuItemLinkProps = React.PropsWithChildren<{
  url: string;
  icon?: IconType;
  className?: string;
  onClick?: (evt: React.SyntheticEvent<any>) => void;
  unreadInfoStoreSelector?: UI.UnreadInfoStoreSelector;
  session?: UI.SessionItemBase;
}>;

const getUrgencies = (
  unreadInfoStore: UI.UnreadInfoStore | UI.SessionSlice<UI.SessionType> | null,
  session: UI.SessionItemBase | undefined,
): UI.UrgencyCountMap | null => {
  if (!unreadInfoStore) {
    return null;
  }

  if (!!session && 'getSession' in unreadInfoStore) {
    // Session objects are immutable so the one received via props
    // may be outdated already
    const currentSession = unreadInfoStore.getSession(session.id);
    return !!currentSession ? unreadInfoStore.getItemUrgencies(currentSession) : null;
  }

  return unreadInfoStore.getTotalUrgencies();
};

// Route link with support for urgencies
const RouterMenuItemLink = memo<RouterMenuItemLinkProps>(
  function RouterMenuItemLink({
    onClick,
    className,
    icon,
    url,
    children,
    unreadInfoStoreSelector,
    session,
  }) {
    const unreadInfoStore = useSessionStoreProperty((state) =>
      unreadInfoStoreSelector ? unreadInfoStoreSelector(state) : null,
    );

    const urgencies = getUrgencies(unreadInfoStore, session);
    return (
      <NavLink
        end={url === '/'}
        to={url}
        className={({ isActive }) => classNames('item', className, { active: isActive })}
        onClick={onClick}
        role="menuitem"
      >
        <Icon icon={icon} />
        {children}
        {!!unreadInfoStore && <CountLabel urgencies={urgencies} />}
      </NavLink>
    );
  } /*,
  (prevProps, nextProps) => {
    return (
      // nextProps.location.key === prevProps.location.key &&
      nextProps.session === prevProps.session
    );
  }*/,
);

export default RouterMenuItemLink;
