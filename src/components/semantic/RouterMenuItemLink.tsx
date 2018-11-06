'use strict';
//import PropTypes from 'prop-types';
import React, { useState, useEffect, memo } from 'react';
//import createReactClass from 'create-react-class';

//@ts-ignore
//import Reflux from 'reflux';

import classNames from 'classnames';
//import isEqual from 'lodash/isEqual';

import { NavLink /*, matchPath*/ } from 'react-router-dom';
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

// A component that will re-render only when urgencies or active state are updated
// TODO: session code doesn't work with SessionMenuItem yet
const RouterMenuItemLink: React.SFC<RouterMenuItemLinkProps> = memo((props) => {
  const { onClick, className, icon, url, children, unreadInfoStore } = props;
  
  const [ urgencies, setUrgencies ] = useState<UI.UrgencyCountMap | null>(getUrgencies(props));
  useEffect(
    () => {
      if (unreadInfoStore) {
        return unreadInfoStore.listen(() => {
          setUrgencies(getUrgencies(props));
        });
      }
    },
    []
  );

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


/*const RouterMenuItemLink = createReactClass({
  isActive(router) {
    return !!matchPath(router.route.location.pathname, {
      path: this.props.url,
      exact: this.props.url === '/',
    });
  },

  shouldComponentUpdate(nextProps, nextState, nextContext) {
    // Session (or its properties) updated/changed?
    if (nextProps.session !== this.props.session) {
      return true;
    }

    // Active state changed?
    if (this.isActive(this.context.router) !== this.isActive(nextContext.router)) {
      return true;
    }

    // Urgencies updated
    if (!isEqual(nextState.urgencies, this.state.urgencies)) {
      return true;
    }

    return false;
  },

  render() {
    const { onClick, className, icon, url, children, unreadInfoStore } = this.props;
    const { urgencies } = this.state;

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
        { unreadInfoStore && <CountLabel urgencies={ urgencies }/> }
      </NavLink>
    );
  },
});*/

export const MenuHeader: React.SFC<{ className?: string; }> = ({ className, children, ...other }) => (
  <div className={ classNames('header', className) } { ...other }>
    { children }
  </div>
);

export default RouterMenuItemLink;