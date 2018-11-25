'use strict';
import React, { useState, useEffect, memo } from 'react';

import classNames from 'classnames';

import { NavLink } from 'react-router-dom';
import CountLabel from 'components/CountLabel';
import Icon, { IconType } from 'components/semantic/Icon';


import * as UI from 'types/ui';


interface RouterMenuItemLinkProps {
  url: string;
  icon?: IconType;
  className?: string;
  onClick?: (evt: React.SyntheticEvent<any>) => void;
  unreadInfoStore?: any;
  session?: UI.SessionItemBase;
}


const getUrgencies = (props: RouterMenuItemLinkProps): UI.UrgencyCountMap | null => {
  const { unreadInfoStore, session } = props;
  if (!unreadInfoStore) {
    return null;
  }

  if (!!session) {
    // Session objects are immutable so the one received via props
    // may be outdated already
    const currentSession = unreadInfoStore.getSession(session.id);
    return !!currentSession ? unreadInfoStore.getItemUrgencies(currentSession) : null;
  }

  return unreadInfoStore.getTotalUrgencies();
};

const useUrgencies = (props: RouterMenuItemLinkProps) => {
  const [ urgencies, setUrgencies ] = useState<UI.UrgencyCountMap | null>(getUrgencies(props));
  useEffect(
    () => {
      if (props.unreadInfoStore) {
        return props.unreadInfoStore.listen(() => {
          setUrgencies(getUrgencies(props));
        });
      }
    },
    []
  );

  return urgencies;
};

// A component that will re-render only when urgencies or active state are updated
// TODO: session code doesn't work with SessionMenuItem yet
const RouterMenuItemLink: React.SFC<RouterMenuItemLinkProps> = memo((props) => {
  const urgencies = useUrgencies(props);

  const { onClick, className, icon, url, children, unreadInfoStore } = props;
  return (
    <NavLink 
      exact={ url === '/' }
      to={ url } 
      className={ classNames('item', className) } 
      activeClassName="active" 
      onClick={ onClick }
    >
      <Icon icon={ icon }/>
      { children }
      { !!unreadInfoStore && <CountLabel urgencies={ urgencies }/> }
    </NavLink>
  );
});

export default RouterMenuItemLink;