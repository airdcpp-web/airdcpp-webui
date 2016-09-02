'use strict';
import React from 'react';
import Reflux from 'reflux';

import classNames from 'classnames';
import deepEqual from 'deep-equal';

import { Link } from 'react-router';
import CountLabel from 'components/CountLabel';
import Icon from 'components/semantic/Icon';


// A component that will re-render only when urgencies or active state are updated
// TODO: session code doesn't work with SessionMenuItem yet
export const PureRouterMenuItemLink = React.createClass({
	mixins: [ Reflux.ListenerMixin ],
	contextTypes: {
		router: React.PropTypes.object.isRequired,
	},

	propTypes: {
		/**
		 * Item URL
		 */
		url: React.PropTypes.string.isRequired,

		/**
		 * Title of the menu item
		 */
		children: React.PropTypes.any.isRequired,

		icon: React.PropTypes.node,

		className: React.PropTypes.string,

		/**
		 * For overriding the default link action (still gives the active class style)
		 */
		onClick: React.PropTypes.func,

		unreadInfoStore: React.PropTypes.object,

		session: React.PropTypes.object,
	},

	getUrgencies() {
		const { unreadInfoStore, session } = this.props;
		if (!unreadInfoStore) {
			return null;
		}

		if (session) {
			return unreadInfoStore.getItemUrgencies(session);
		}

		return unreadInfoStore.getTotalUrgencies();
	},

	getInitialState() {
		return {
			urgencies: this.getUrgencies(),
		};
	},

	shouldComponentUpdate(nextProps, nextState) {
		// Session updated/changed?
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
		return !deepEqual(nextState.urgencies, this.state.urgencies);
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
		const { onClick, className, icon, url, children } = this.props;
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
				{ urgencies ? <CountLabel urgencies={ urgencies }/> : null }
			</Link>
		);
	}
});


export const RouterMenuItemLink = ({ url, className, icon, children, onClick, urgencies }) => {
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
			{ urgencies ? <CountLabel urgencies={ urgencies }/> : null }
		</Link>
	);
};

RouterMenuItemLink.propTypes = {
	/**
	 * Item URL
	 */
	url: React.PropTypes.string.isRequired,

	/**
	 * Title of the button
	 */
	children: React.PropTypes.any.isRequired,

	icon: React.PropTypes.node,

	/**
	 * For overriding the default link action (still gives the active class style)
	 */
	onClick: React.PropTypes.func,

	urgencies: React.PropTypes.object,
};


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
	children: React.PropTypes.any.isRequired,

	icon: React.PropTypes.string,

	onClick: React.PropTypes.func.isRequired,

	active: React.PropTypes.bool,
};

export const MenuHeader = ({ className, children, ...other }) => (
 	<div className={ classNames('header', className) } { ...other }>
 		{ children }
 	</div>
);

//export default MenuItemLink;