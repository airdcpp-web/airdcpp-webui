'use strict';
import PropTypes from 'prop-types';
import React from 'react';
import createReactClass from 'create-react-class';
import Reflux from 'reflux';

import classNames from 'classnames';
import isEqual from 'lodash/isEqual';

import { NavLink, matchPath } from 'react-router-dom';
import CountLabel from 'components/CountLabel';
import Icon, { IconType } from 'components/semantic/Icon';


// A component that will re-render only when urgencies or active state are updated
// TODO: session code doesn't work with SessionMenuItem yet
const RouterMenuItemLink = createReactClass({
  displayName: 'RouterMenuItemLink',
  mixins: [ Reflux.ListenerMixin ],

  contextTypes: {
    router: PropTypes.object.isRequired,
  },

  propTypes: {
    /**
		 * Item URL
		 */
    url: PropTypes.string.isRequired,

    /**
		 * Title of the menu item
		 */
    children: PropTypes.any.isRequired,

    icon: PropTypes.node,

    className: PropTypes.string,

    /**
		 * For overriding the default link action (still gives the active class style)
		 */
    onClick: PropTypes.func,

    unreadInfoStore: PropTypes.object,

    /**
		 * Session object
		 */
    session: PropTypes.object,
  },

  getUrgencies() {
    const { unreadInfoStore, session } = this.props;
    if (!unreadInfoStore) {
      return null;
    }

    if (session) {
      // Session objects are immutable so the one received via props
      // may be outdated already
      const currentSession = unreadInfoStore.getSession(session.id);
      return currentSession ? unreadInfoStore.getItemUrgencies(currentSession) : null;
    }

    return unreadInfoStore.getTotalUrgencies();
  },

  getInitialState() {
    return {
      urgencies: this.getUrgencies(),
    };
  },

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

  componentDidMount() {
    const { unreadInfoStore } = this.props;
    if (unreadInfoStore) {
      this.listenTo(unreadInfoStore, this.onStoreUpdated);
    }
  },

  onStoreUpdated() {
    this.setState({
      urgencies: this.getUrgencies(),
    });
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
});

export const MenuHeader = ({ className, children, ...other }) => (
 	<div className={ classNames('header', className) } { ...other }>
 		{ children }
 	</div>
);

export default RouterMenuItemLink;