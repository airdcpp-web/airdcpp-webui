import React from 'react';
import { SETTING_ITEMS_URL } from 'constants/SettingConstants';

import SocketService from 'services/SocketService';
import NotificationActions from 'actions/NotificationActions';

import Form from 'components/Form';

const SettingForm = React.createClass({
	contextTypes: {
		onSettingsChanged: React.PropTypes.func.isRequired
	},

	propTypes: {
		/**
		 * Form items to list
		 */
		formItems: React.PropTypes.object.isRequired,

		/**
		 * Optional callback that is called when a value was changed
		 * Receives the new value and changed field id as parameter
		 */
		onChange: React.PropTypes.func,
	},

	getInitialState() {
		return {
			sourceData: null
		};
	},

	onSettingsReceived(data) {
		this.setState({ sourceData: data });
	},

	componentDidMount() {
		this.fetchSettings();
	},

	fetchSettings() {
		const keys = Object.keys(this.props.formItems);
		SocketService.get(SETTING_ITEMS_URL, keys)
			.then(this.onSettingsReceived)
			.catch(error => 
				NotificationActions.apiError('Failed to fetch settings', error)
			);
	},

	onChange(value, valueKey, hasChanges) {
		this.context.onSettingsChanged(hasChanges);

		if (this.props.onChange) {
			this.props.onChange(value, valueKey, hasChanges);
		}
	},

	onSave(changedSettingArray) {
		return SocketService.post(SETTING_ITEMS_URL, changedSettingArray).then(this.onSettingsSaved)
			.then(() => {
				this.fetchSettings();
				NotificationActions.success({ 
					title: 'Saving completed',
					message: 'Settings were saved successfully',
				});
			});
	},

	save() {
		this.refs.form.save();
	},

	render: function () {
		return (
			<div>
				<Form
					ref="form"
					onChange={this.onChange}
					sourceData={this.state.sourceData}
					onSave={this.onSave}
					{ ...this.props }
				/>
			</div>);
	}
});

export default SettingForm;