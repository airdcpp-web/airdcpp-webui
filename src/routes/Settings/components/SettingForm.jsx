import React from 'react';
import { SETTING_ITEMS_URL } from 'constants/SettingConstants';

import SocketService from 'services/SocketService';
import SaveSection from './SaveSection';
import NotificationActions from 'actions/NotificationActions';

import deepEqual from 'deep-equal';
import _ from 'lodash';

import t from 'utils/tcomb-form';

const Form = t.form.Form;

const SettingForm = React.createClass({
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

	convertRawSetting(settings, rawSetting) {
		// Convert empty strings for easier comparison as tcomb will use null for returned values
		settings[rawSetting.key] = rawSetting.value === '' ? null : rawSetting.value;
		return settings;
	},

	onSettingsReceived(data) {
		this.settingInfo = data;

		const value = data.reduce(this.convertRawSetting, {});
		this.updateOriginalValue(value);
	},

	updateOriginalValue(newValue) {
		if (this.props.onCurrentSettings) {
			this.props.onCurrentSettings(newValue);
		}

		this.originalSetting = newValue;
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

	onChange(value, path) {
		this.refs.form.getComponent(path).validate();
		if (this.props.onChange) {
			this.props.onChange(value, path);
		}

		this.setState({ value: value });
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
				if (deepEqual(this.originalSetting[valueKey], value[valueKey])) {
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

	reduceFieldOptions(options, setting) {
		const autoDetected = this.settingInfo.auto && this.originalSetting[setting.key] === setting.value;
		const legend = setting.title + (autoDetected ? ' (auto detected)' : '');
		const fieldOptions = {
			legend: legend,
		};

		if (autoDetected && this.props.disableAutoDetected) {
			fieldOptions['disabled'] = true;
		}

		if (setting.values) {
			// Enum select field
			Object.assign(fieldOptions, {
				factory: t.form.Select,
				options: setting.values,
				nullOption: false,
			});

			if (setting.value && setting.value === parseInt(setting.value, 10)) {
				// Integer keys won't work, use string conversion
				fieldOptions['transformer'] = {
					format: v => String(v),
					parse: v => parseInt(v, 10)
				};
			}
		}

		if (this.props.onFieldSetting) {
			// string -> int conversion if needed
			const rawValue = this.state.value[setting.key];
			this.props.onFieldSetting(setting.key, fieldOptions, fieldOptions.transformer ? fieldOptions.transformer.parse(rawValue) : rawValue, this.state.value);
		}

		options[setting.key] = fieldOptions;
		return options;
	},

	render: function () {
		if (!this.settingInfo) {
			return <div className="ui active text loader">Loading</div>;
		}

		const options = {};
		options['fields'] = this.settingInfo.reduce(this.reduceFieldOptions, {});

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
				<SaveSection saveHandler={this.save} hasChanges={!deepEqual(this.originalSetting, this.state.value)}/>
			</div>);
	}
});

export default SettingForm;