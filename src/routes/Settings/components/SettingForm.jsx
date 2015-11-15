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

		/**
		 * Possible header for the form
		 */
		title: React.PropTypes.node,
	},

	getInitialState() {
		return {
			sourceData: null
		};
	},

	onSettingsReceived(data) {
		this.setState({ sourceData: Object.assign(this.state.sourceData || {}, data) });
	},

	componentDidMount() {
		this.fetchSettings();
	},

	fetchSettings() {
		const keys = Object.keys(this.props.formItems);

		SocketService.get(SETTING_ITEMS_URL, { 
			keys: keys
		})
			.then(this.onSettingsReceived)
			.catch(error => 
				NotificationActions.apiError('Failed to fetch settings', error)
			);
	},

	onFieldChanged(id, value, hasChanges) {
		this.context.onSettingsChanged(id, value, hasChanges);

		if (this.props.onFieldChanged) {
			return this.props.onFieldChanged(id, value, hasChanges);
		}
	},

	onSave(changedSettingArray) {
		return SocketService.post(SETTING_ITEMS_URL, changedSettingArray)
			.then(this.fetchSettings);
	},

	save() {
		this.refs.form.save();
	},

	render: function () {
		return (
			<div className="setting-form">
				{ this.props.title ? <div className="ui header">{ this.props.title } </div> : null }
				<Form
					{ ...this.props }
					ref="form"
					onFieldChanged={this.onFieldChanged}
					sourceData={this.state.sourceData}
					onSave={this.onSave}
				/>
			</div>);
	}
});

export default SettingForm;