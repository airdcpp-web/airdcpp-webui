import React from 'react';
import { SETTING_MODULE_URL } from 'constants/SettingConstants';

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
		this.originalSetting = newValue;
		this.setState({ value: _.clone(newValue) });
	},

	componentDidMount() {
		const keys = Object.keys(this.props.formItems);
		SocketService.get(SETTING_MODULE_URL, keys)
			.then(this.onSettingsReceived)
			.catch(error => 
				console.error('Failed to load settings: ' + error)
			);
	},

	onChange(value, path) {
		this.refs.form.getComponent(path).validate();
		this.setState({ value: value });
	},

	_handleError(error) {
		if (error.code === 422) {
			this.setState({ error: error.json });
		} else {
			// ?
		}
	},

	onSettingsSaved() {
		this.updateOriginalValue(this.state.value);
		NotificationActions.success({ 
			title: 'Saving completed',
			message: 'Settings were saved successfully',
		});		
	},

	postSettings(changedSettingArray) {
		return SocketService.post(SETTING_MODULE_URL, changedSettingArray)
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
		const fieldOptions = {
			legend: setting.title,
		};

		if (setting.values) {
			// Enum select field
			Object.assign(fieldOptions, {
				factory: t.form.Select,
				options: setting.values,
				nullOption: false,
				transformer: {
					format: v => String(v),
					parse: v => parseInt(v, 10)
				}
			});
		}

		if (this.props.onFieldSetting) {
			// string -> int conversion if needed
			const rawValue = this.state.value[setting.key];
			this.props.onFieldSetting(setting.key, fieldOptions, fieldOptions.transformer ? fieldOptions.transformer.parse(rawValue) : rawValue);
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