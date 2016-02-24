import React from 'react';
import invariant from 'invariant';


export const LocationContext = {
	propTypes: {
		location: React.PropTypes.object.isRequired,
	},

	childContextTypes: {
		routerLocation: React.PropTypes.object.isRequired,
	},

	getChildContext() {
		return {
			routerLocation: this.props.location || this.context.location,
		};
	},
};

export const RouteContext = {
	propTypes: {
		route: React.PropTypes.object.isRequired,
	},

	childContextTypes: {
		route: React.PropTypes.object.isRequired,
	},

	getChildContext() {
		return {
			route: this.props.route,
		};
	},
};

export const Lifecycle = {
	contextTypes: {
		route: React.PropTypes.object,
		router: React.PropTypes.object.isRequired,
	},

	propTypes: {
		route: React.PropTypes.object,
	},

	componentDidMount() {
		const { router } = this.context;
		const route = this.props.route || this.context.route;
		
		invariant(route, 'Route not provided for Lifecycle mixin');
		invariant(this.routerWillLeave, 'routerWillLeave must exist with Lifecycle mixin');

		router.setRouteLeaveHook(route, this.routerWillLeave);
	},
};