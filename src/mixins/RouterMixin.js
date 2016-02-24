import React from 'react';

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

export const RouterContext = {
	contextTypes: {
		router: React.PropTypes.object.isRequired
	},

	propTypes: {
		route: React.PropTypes.object.isRequired,
	},

	childContextTypes: {
		route: React.PropTypes.object.isRequired,
		router: React.PropTypes.object.isRequired,
	},

	getChildContext() {
		return {
			route: this.props.route,
			router: this.context.router,
		};
	},
};

export const Lifecycle = {
	contextTypes: {
		route: React.PropTypes.object.isRequired,
		router: React.PropTypes.object.isRequired,
	},

	componentDidMount() {
		const { route, router } = this.context;
		router.setRouteLeaveHook(route, this.routerWillLeave);
	},
};