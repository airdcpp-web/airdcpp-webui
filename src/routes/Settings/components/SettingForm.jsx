import React from 'react';
import NotificationActions from 'actions/NotificationActions';

import FormUtils from 'utils/FormUtils';
import { FieldTypes } from 'constants/SettingConstants';

import BrowseField from 'components/form/BrowseField';
import Form from 'components/form/Form';

import t from 'utils/tcomb-form';


const SettingForm = React.createClass({
	contextTypes: {
		onSettingsChanged: React.PropTypes.func,
		routerLocation: React.PropTypes.object.isRequired
	},

	propTypes: {
		/**
		 * Form items to list
		 */
		formItems: React.PropTypes.object.isRequired,

		onFetchSettings: React.PropTypes.func.isRequired,

		onSave: React.PropTypes.func.isRequired,
	},

	getInitialState() {
		return {
			sourceData: null
		};
	},

	onSettingsReceived(data) {
		this.setState({ 
			sourceData: Object.assign({}, data) 
		});
	},

	componentDidMount() {
		this.fetchSettings();
	},

	fetchSettings() {
		this.props.onFetchSettings()
			.then(this.onSettingsReceived)
			.catch(error => 
				NotificationActions.apiError('Failed to fetch settings', error)
			);
	},

	onFieldSetting(settingKey, fieldOptions, formValue, sourceData) {
		const sourceItem = sourceData[settingKey];

		// Title
		if (sourceItem.title) {
			let legend = sourceItem.title;

			const autoDetected = sourceItem.auto && sourceItem.value === formValue[settingKey];
			if (autoDetected) {
				legend += ' (auto detected)';
			}

			if (sourceItem.unit) {
				legend += ' (' + sourceItem.unit + ')';
			}

			fieldOptions['legend'] = legend;
		}

		// Field type
		switch (sourceItem.type) {
			case FieldTypes.TEXT: {
				fieldOptions['type'] = 'textarea';
				break;
			} 
			//case FieldTypes.FILE_PATH:
			case FieldTypes.DIRECTORY_PATH: {
				fieldOptions['factory'] = t.form.Textbox;
				fieldOptions['template'] = BrowseField;

				// TODO: file selector dialog
				fieldOptions['config'] = {
					isFile: sourceItem.type === FieldTypes.FILE_PATH
				};
			}
			default:
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
		if (this.context.onSettingsChanged) {
			this.context.onSettingsChanged(id, value, hasChanges);
		}

		if (this.props.onFieldChanged) {
			return this.props.onFieldChanged(id, value, hasChanges);
		}

		return null;
	},

	onSave(changedSettingArray) {
		return this.props.onSave(changedSettingArray)
			.then(this.fetchSettings);
	},

	save() {
		return this.refs.form.save();
	},

	render: function () {
		return (
			<Form
				{ ...this.props }
				ref="form"
				onFieldChanged={ this.onFieldChanged }
				onFieldSetting={ this.onFieldSetting }
				sourceData={ this.state.sourceData }
				onSave={ this.onSave }
				context={{ 
					location: this.context.routerLocation 
				}}
			/>
		);
	}
});

export default SettingForm;