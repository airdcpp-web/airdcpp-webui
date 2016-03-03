import React from 'react';

import Promise from 'utils/Promise';

import AccessConstants from 'constants/AccessConstants';
import LoginStore from 'stores/LoginStore';


const SettingPageMixin = function () {
	const refs = Array.prototype.slice.call(arguments);

	const Mixin = {
		propTypes: {
			onSettingsChanged: React.PropTypes.func,
			location: React.PropTypes.object,
		},

		contextTypes: {
			router: React.PropTypes.object.isRequired,
			onSettingsChanged: React.PropTypes.func,
			routerLocation: React.PropTypes.object,
		},

		childContextTypes: {
			onSettingsChanged: React.PropTypes.func.isRequired,
			routerLocation: React.PropTypes.object.isRequired
		},

		componentDidMount() {
			this.changedProperties = new Set();

			const { route } = this.props;
			if (route) {
				const { router } = this.context;
				router.setRouteLeaveHook(route, this.routerWillLeave);
			}
		},

		getChildContext() {
			return {
				onSettingsChanged: this.onSettingsChangedInternal,
				routerLocation: this.context.routerLocation || this.props.location,
			};
		},

		save() {
			const promises = refs.map(ref => this.refs[ref].save());
			this.changedProperties.clear();

			return Promise.all(promises);
		},

		onSettingsChangedInternal(id, value, hasChanges) {
			if (this.context.onSettingsChanged) {
				// Only the topmost mixin keeps track of changed settings
				this.context.onSettingsChanged(id, value, hasChanges);
				return;
			}

			if (hasChanges) {
				this.changedProperties.add(...id);
			} else {
				this.changedProperties.delete(...id);
			}

			this.props.onSettingsChanged(this.changedProperties.size > 0);
		},

		routerWillLeave(nextLocation) {
			// Are we opening a dialog?
			// Check later if this is fixed by https://github.com/reactjs/react-router/pull/3107
			if (nextLocation.pathname.indexOf(this.props.location.pathName) === -1) {
				return null;
			}

			if (this.changedProperties.size > 0 && LoginStore.hasAccess(AccessConstants.SETTINGS_EDIT)) {
				return 'You have unsaved changes. Are you sure you want to leave?';
			}

			return null;
		},
	};

	return Mixin;
};

export default SettingPageMixin;