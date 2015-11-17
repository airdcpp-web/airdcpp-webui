import React from 'react';

import Promise from 'utils/Promise';

const SettingPageMixin = function () {
	//const getChangeHandler = () => this.props.onSettingsChanged || this.context.onSettingsChanged;
	const refs = Array.prototype.slice.call(arguments);

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
				onSettingsChanged: this.context.onSettingsChanged || this.props.onSettingsChanged,
				location: this.props.location,
			};
		},

		save() {
			const promises = refs.map(ref => this.refs[ref].save());

			return Promise.all(promises);
		}
	};

	return Mixin;
};

export default SettingPageMixin;