import React from 'react';

import LocalSettingStore from 'stores/LocalSettingStore';

import SettingForm from './SettingForm';


const LocalSettingForm = React.createClass({
	propTypes: {
		/**
		 * Form items to list
		 */
		formItems: React.PropTypes.object.isRequired,
	},

	onFetchSettings() {
		return Promise.resolve(LocalSettingStore.getInfos(Object.keys(this.props.formItems)));
	},

	onSave(changedSettingArray) {
		return Promise.resolve(LocalSettingStore.setValues(changedSettingArray));
	},

	save() {
		return this.refs.form.save();
	},

	render: function () {
		return (
			<div className="local setting-form">
				<SettingForm
					{ ...this.props }
					ref="form"
					onFetchSettings={ this.onFetchSettings }
					onSave={ this.onSave }
				/>
			</div>
		);
	}
});

export default LocalSettingForm;