import React from 'react';
import Promise from 'utils/Promise';
import { SETTING_ITEMS_URL } from 'constants/SettingConstants';

import SocketService from 'services/SocketService';
import NotificationActions from 'actions/NotificationActions';

import deepEqual from 'deep-equal';
import _ from 'lodash';

import t from 'utils/tcomb-form';

const Form = t.form.Form;

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
		 * Optional callback for appending field settings
		 * Receives the object of already appended settings and the setting item received from API
		 */
		onFieldSetting: React.PropTypes.func,

		/**
		 * Optional callback that is called when save button is pressed
		 * Receives the changed fields as parameter
		 * Must return promise
		 */
		onSave: React.PropTypes.func,

		/**
		 * Optional callback that is called when a value was changed
		 * Receives the new value and changed field id as parameter
		 */
		onChange: React.PropTypes.func,

		/**
		 * Optional callback that is called when the setting array is received from the server
		 * Receives the setting array as parameter
		 */
		onCurrentSettings: React.PropTypes.func,

		/**
		 * Disable fields for auto detected settings
		 */
		disableAutoDetected: React.PropTypes.func,
	},

	getInitialState() {
		return {
			error: null,
			value: null
		};
	},

	onSettingsReceived(data) {
		// Convert empty strings to nulls (that's what tcomb will use)
		for (let key in data) {
			if (data[key].value === '') {
				data[key].value = null;
			}
		}

		// Get a simple key-value map for the form
		const value = Object.keys(data).reduce((valueMap, key) => {
			valueMap[key] = data[key].value;
			return valueMap;
		}, {});

		this.updateOriginalValue(value, data);
	},

	updateOriginalValue(newValue, apiSettingInfos) {
		if (this.props.onCurrentSettings) {
			this.props.onCurrentSettings(newValue);
		}

		this.apiSettingInfos = apiSettingInfos;
		this.setState({ value: _.clone(newValue) });
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

	hasChanges(newValue) {
		return Object.keys(this.state.value).some(key => this.apiSettingInfos[key].value !== newValue[key] );
	},

	onChange(value, valueKey) {
		// Make sure that we have a converted value
		const result = this.refs.form.getComponent(valueKey).validate();
		value[valueKey] = result.value;

		if (this.props.onChange) {
			this.props.onChange(value, valueKey);
		}

		this.setState({ value: value });

		this.context.onSettingsChanged(this.hasChanges(value));
	},

	_handleError(error) {
		if (error.code === 422) {
			this.setState({ error: error.json });
		} else {
			NotificationActions.apiError('Failed to save settings', error);
		}
	},

	onSettingsSaved() {
		this.fetchSettings();
		//this.updateOriginalValue(this.state.value);
		NotificationActions.success({ 
			title: 'Saving completed',
			message: 'Settings were saved successfully',
		});
	},

	postSettings(changedSettingArray) {
		return SocketService.post(SETTING_ITEMS_URL, changedSettingArray)
				.then(this.onSettingsSaved)
				.catch(this._handleError);
	},

	save() {
		let value = this.refs.form.getValue();
		if (value) {
			// Filter the changed settings
			const changedSettingArray = Object.keys(value).reduce((settings, valueKey) => {
				if (deepEqual(this.apiSettingInfos[valueKey].value, value[valueKey])) {
					return settings;
				}

				settings[valueKey] = value[valueKey];
				return settings;
			}.bind(this), {}); 

			if (this.props.onSave) {
				this.props.onSave(changedSettingArray);
				//return this.props.onSave(changedSettingArray)
				//	.then(() => postSettings(changedSettingArray));
			}

			return this.postSettings(changedSettingArray);
		}

		return Promise.reject();
	},

	getFieldOptions(optionsObject, settingKey) {
		const apiSetting = this.apiSettingInfos[settingKey];

		const currentRawValue = this.state.value[settingKey];
		const autoDetected = apiSetting.auto && apiSetting.value === currentRawValue;
		const legend = apiSetting.title + (autoDetected ? ' (auto detected)' : '');

		const fieldOptions = {
			legend: legend,
		};

		if (autoDetected && this.props.disableAutoDetected) {
			fieldOptions['disabled'] = true;
		}

		if (apiSetting.values) {
			// Enum select field
			Object.assign(fieldOptions, {
				factory: t.form.Select,
				options: apiSetting.values,
				nullOption: false,
			});

			if (apiSetting.value && apiSetting.value === parseInt(apiSetting.value, 10)) {
				// Integer keys won't work, use string conversion
				fieldOptions['transformer'] = {
					format: v => String(v),
					parse: v => parseInt(v, 10)
				};
			}
		}

		if (this.props.onFieldSetting) {
			// string -> int conversion if needed
			this.props.onFieldSetting(settingKey, fieldOptions, fieldOptions.transformer ? fieldOptions.transformer.parse(currentRawValue) : currentRawValue, this.state.value);
		}

		optionsObject[settingKey] = fieldOptions;
		return optionsObject;
	},

	render: function () {
		if (!this.apiSettingInfos) {
			return <div className="ui active text loader">Loading</div>;
		}

		const options = {};
		options['fields'] = Object.keys(this.apiSettingInfos).reduce(this.getFieldOptions, {});

		const { error } = this.state;
		if (error) {
			options.fields[error.field] = options.fields[error.field] || {};
			Object.assign(options.fields[error.field], {
				error: error.message,
				hasError: true
			});
		}

		return (
			<div>
				<Form
					ref="form"
					type={t.struct(this.props.formItems)}
					options={options}
					value={this.state.value}
					onChange={this.onChange}
				/>
			</div>);
	}
});

export default SettingForm;