import PropTypes from 'prop-types';
import invariant from 'invariant';


export const LocationContext = {
	propTypes: {
		location: PropTypes.object.isRequired,
	},

	childContextTypes: {
		routerLocation: PropTypes.object.isRequired,
	},

	getChildContext() {
		return {
			routerLocation: this.props.location || this.context.location,
		};
	},
};

export const RouteContext = {
	propTypes: {
		route: PropTypes.object.isRequired,
	},

	childContextTypes: {
		route: PropTypes.object.isRequired,
	},

	getChildContext() {
		return {
			route: this.props.route,
		};
	},
};

export const Lifecycle = {
	contextTypes: {
		route: PropTypes.object,
		router: PropTypes.object.isRequired,
	},

	propTypes: {
		route: PropTypes.object,
	},

	componentDidMount() {
		const { router } = this.context;
		const route = this.props.route || this.context.route;
		
		invariant(route, 'Route not provided for Lifecycle mixin');
		invariant(this.routerWillLeave, 'routerWillLeave must exist with Lifecycle mixin');

		this.removeRouteLeaveHook = router.setRouteLeaveHook(route, this.routerWillLeave);
	},

	componentWillUnmount() {
		// React router will remove the hook only when leaving the route
		// Components may be unmounted without leaving the route when socket connection is closed, which requires manual cleanup
		this.removeRouteLeaveHook();
	},
};