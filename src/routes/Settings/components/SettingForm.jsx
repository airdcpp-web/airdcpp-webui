import React from 'react';
import SettingConstants from 'constants/SettingConstants';

import SocketService from 'services/SocketService';
import NotificationActions from 'actions/NotificationActions';

import FormUtils from 'utils/FormUtils';

import BrowseField from 'components/form/BrowseField';
import Form from 'components/form/Form';

import t from 'utils/tcomb-form';

const SettingForm = React.createClass({
	contextTypes: {
		onSettingsChanged: React.PropTypes.func.isRequired,
		routerLocation: React.PropTypes.object.isRequired
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

		SocketService.post(SettingConstants.ITEMS_INFO_URL, { 
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
			fieldOptions['factory'] = t.form.Textbox;
			fieldOptions['template'] = BrowseField;
		} else if (sourceItem.type === 'long_text') {
			fieldOptions['type'] = 'textarea';
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

		return null;
	},

	onSave(changedSettingArray) {
		return SocketService.post(SettingConstants.ITEMS_SET_URL, changedSettingArray)
			.then(this.fetchSettings);
	},

	save() {
		return this.refs.form.save();
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
					context={{ location: this.context.routerLocation }}
				/>
			</div>);
	}
});

export default SettingForm;