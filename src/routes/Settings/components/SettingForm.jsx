import React from 'react';
import { SETTING_ITEMS_URL } from 'constants/SettingConstants';

import SocketService from 'services/SocketService';
import NotificationActions from 'actions/NotificationActions';

import BrowseField from 'components/filebrowser/BrowseField';
import FormUtils from 'utils/FormUtils';
import Form from 'components/Form';

import t from 'utils/tcomb-form';

const SettingForm = React.createClass({
	contextTypes: {
		onSettingsChanged: React.PropTypes.func.isRequired,
		location: React.PropTypes.object.isRequired
	},

	propTypes: {
		/**
		 * Form items to list
		 */
		formItems: React.PropTypes.object.isRequired,
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

	onFieldSetting(settingKey, fieldOptions, formValue, sourceData) {
		const sourceItem = sourceData[settingKey];

		const autoDetected = sourceItem.auto && sourceItem.value === formValue[settingKey];

		if (sourceItem.title) {
			let legend = sourceItem.title;

			if (autoDetected) {
				legend += ' (auto detected)';
			}

			if (sourceItem.unit) {
				legend += ' (' + sourceItem.unit + ')';
			}

			fieldOptions['legend'] = legend;
		}

		// Path?
		if (sourceItem.type == 'file_path' || sourceItem.type == 'directory_path') {
			fieldOptions['factory'] = BrowseField;
			fieldOptions['location'] = this.context.location;
		} else if (sourceItem.type === 'long_text') {
			fieldOptions['type'] = 'textfield';
		}

		// Enum select field?
		if (sourceItem.values) {
			Object.assign(fieldOptions, {
				factory: t.form.Select,
				options: sourceItem.values,
				nullOption: false,
			});

			// Integer keys won't work, do string conversion
			if (sourceItem.value === parseInt(sourceItem.value, 10)) {
				fieldOptions['transformer'] = FormUtils.intTransformer;
			}
		}

		// Let the parents add their own settings
		if (this.props.onFieldSetting) {
			this.props.onFieldSetting(settingKey, fieldOptions, formValue, sourceData);
		}
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
				<Form
					{ ...this.props }
					ref="form"
					onFieldChanged={this.onFieldChanged}
					onFieldSetting={this.onFieldSetting}
					sourceData={this.state.sourceData}
					onSave={this.onSave}
				/>
			</div>);
	}
});

export default SettingForm;