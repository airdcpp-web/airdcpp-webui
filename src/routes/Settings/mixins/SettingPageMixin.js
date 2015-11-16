import React from 'react';

import Promise from 'utils/Promise';

const SettingPageMixin = function () {
	//const getChangeHandler = () => this.props.onSettingsChanged || this.context.onSettingsChanged;
	const refs = Array.prototype.slice.call(arguments);
	const changedProperties = new Set();

	//const refs = Array.prototype.slice.call(arguments);
	const Mixin = {
		propTypes: {
			onSettingsChanged: React.PropTypes.func
		},

		contextTypes: {
			onSettingsChanged: React.PropTypes.func
		},

		childContextTypes: {
			onSettingsChanged: React.PropTypes.func.isRequired,
			location: React.PropTypes.object.isRequired
		},

		getChildContext() {
			return {
				onSettingsChanged: this.onSettingsChangedInternal,
				location: this.props.location,
			};
		},

		onSettingsChangedInternal(id, value, hasChanges) {
			if (this.context.onSettingsChanged) {
				this.context.onSettingsChanged(id, value, hasChanges);
				return;
			}

			if (hasChanges) {
				changedProperties.add(...id);
			} else {
				changedProperties.delete(...id);
			}

			this.props.onSettingsChanged(changedProperties.size > 0);
		},

		save() {
			const promises = refs.map(ref => this.refs[ref].save());

			return Promise.all(promises);
		}
	};

	return Mixin;
};

export default SettingPageMixin;