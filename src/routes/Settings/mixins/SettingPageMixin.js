import React from 'react';

import invariant from 'invariant';
import Promise from 'utils/Promise';

import AccessConstants from 'constants/AccessConstants';
import LoginStore from 'stores/LoginStore';
import { Lifecycle } from 'mixins/RouterMixin';


export const SettingPageMixin = function () {
	const refs = Array.prototype.slice.call(arguments);

	const Mixin = {
		mixins: [ Lifecycle ],
		propTypes: {
			onSettingsChanged: React.PropTypes.func,
			location: React.PropTypes.object,
		},

		contextTypes: {
			onSettingsChanged: React.PropTypes.func,
			routerLocation: React.PropTypes.object,
		},

		childContextTypes: {
			onSettingsChanged: React.PropTypes.func.isRequired,
			routerLocation: React.PropTypes.object.isRequired
		},

		componentDidMount() {
			this.changedProperties = new Set();

			invariant(refs.every(ref => this.refs[ref].hasOwnProperty('save')), 'Invalid refs supplied');
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
			if (hasChanges) {
				this.changedProperties.add(id);
			} else {
				this.changedProperties.delete(id);
			}

			this.props.onSettingsChanged(this.changedProperties.size > 0);
		},

		routerWillLeave(nextLocation) {
			// Are we opening a dialog?
			// Check later if this is fixed by https://github.com/reactjs/react-router/pull/3107
			if (nextLocation.pathname.indexOf(this.props.location.pathname) !== -1) {
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

export const ChildFormMixin = function () {
	const refs = Array.prototype.slice.call(arguments);

	const Mixin = {
		save() {
			const promises = refs.map(ref => this.refs[ref].save());
			return Promise.all(promises);
		},

		onSettingsChangedInternal(id, value, hasChanges) {
			// Only the topmost mixin keeps track of changed settings
			this.context.onSettingsChanged(id, value, hasChanges);
		},
	};

	return Mixin;
};

export default SettingPageMixin;