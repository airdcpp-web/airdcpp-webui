'use strict';
import PropTypes from 'prop-types';
import React from 'react';
import Reflux from 'reflux';

import classNames from 'classnames';
import isEqual from 'lodash/isEqual';

import { Link } from 'react-router';
import CountLabel from 'components/CountLabel';
import Icon from 'components/semantic/Icon';


// A component that will re-render only when urgencies or active state are updated
// TODO: session code doesn't work with SessionMenuItem yet
export const RouterMenuItemLink = React.createClass({
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

	shouldComponentUpdate(nextProps, nextState) {
		// Session (or its properties) updated/changed?
		if (nextProps.session !== this.props.session) {
			return true;
		}

		// Active state changed?
		const isActive = this.context.router.isActive(this.props.url, this.props.url === '/');
		if (isActive !== this.isActive) {
			this.isActive = isActive;
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
			<Link 
				to={ url } 
				className={ classNames('item', className) } 
				activeClassName="active" 
				onClick={ onClick }
				onlyActiveOnIndex={ url === '/' }
			>
				<Icon icon={ icon }/>
				{ children }
				{ unreadInfoStore && <CountLabel urgencies={ urgencies }/> }
			</Link>
		);
	}
});


export const MenuItemLink = ({ className, icon, children, onClick, active, disabled }) => {
	const itemClass = classNames(
		'item',
		className,
		{ 'active': active },
		{ 'disabled': disabled },
	);

	return (
		<a className={ itemClass } onClick={ onClick }>
			<Icon icon={ icon }/>
			{ children }
		</a>
	);
};

MenuItemLink.propTypes = {
	/**
	 * Title of the button
	 */
	children: PropTypes.any.isRequired,

	icon: PropTypes.string,

	onClick: PropTypes.func.isRequired,

	active: PropTypes.bool,
};

export const MenuHeader = ({ className, children, ...other }) => (
 	<div className={ classNames('header', className) } { ...other }>
 		{ children }
 	</div>
);