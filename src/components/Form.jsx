import React from 'react';
import Promise from 'utils/Promise';

import NotificationActions from 'actions/NotificationActions';

import deepEqual from 'deep-equal';
import _ from 'lodash';

import t from 'utils/tcomb-form';

const TcombForm = t.form.Form;

const Form = React.createClass({
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
		 * Called when the form is saved
		 * Receives the changed fields as parameter
		 * Must return promise
		 */
		onSave: React.PropTypes.func.isRequired,

		/**
		 * Optional callback that is called when a value was changed
		 * Receives the new value and changed field id as parameter
		 */
		onChange: React.PropTypes.func,

		/**
		 * Disable fields for auto detected settings
		 */
		disableAutoDetected: React.PropTypes.func,

		/**
		 * Optional callback that is called when the settings are received from the server
		 * Receives the setting object as parameter
		 */
		onSourceDataChanged: React.PropTypes.func,

		/**
		 * Source value to use for initial data
		 */
		sourceData: React.PropTypes.object.isRequired,
	},

	getInitialState() {
		return {
			error: null,
			formValue: null
		};
	},

	componentWillReceiveProps(nextProps) {
		if (nextProps.sourceData !== this.props.sourceData) {
			this.onOriginalValueUpdated(nextProps.sourceData);
		}
	},

	onOriginalValueUpdated(sourceData) {
		// Convert empty strings to nulls (that's what tcomb will use)
		for (let key in sourceData) {
			if (sourceData[key].value === '') {
				sourceData[key].value = null;
			}
		}

		// Get a simple key-value map for the form
		const formValue = Object.keys(sourceData).reduce((valueMap, key) => {
			valueMap[key] = sourceData[key].value;
			return valueMap;
		}, {});

		if (this.props.onSourceDataChanged) {
			this.props.onSourceDataChanged(sourceData);
		}

		this.sourceData = sourceData;
		this.setState({ formValue: _.clone(formValue) });
	},

	updateOriginalValue(newValue, sourceData) {
		this.sourceData = sourceData;
		this.setState({ value: _.clone(newValue) });
	},

	hasChanges(newValue) {
		return Object.keys(this.state.formValue).some(key => this.sourceData[key].value !== newValue[key] );
	},

	onChange(value, valueKey) {
		// Make sure that we have a converted value
		const result = this.refs.form.getComponent(valueKey).validate();
		value[valueKey] = result.value;

		if (this.props.onChange) {
			this.props.onChange(value, valueKey, this.hasChanges(value));
		}

		this.setState({ formValue: value });
	},

	_handleError(error) {
		if (error.code === 422) {
			this.setState({ error: error.json });
		} else {
			NotificationActions.apiError('Failed to save the form', error);
		}
	},

	save() {
		let value = this.refs.form.getValue();
		if (value) {
			// Filter the changed settings
			const changedSettingArray = Object.keys(value).reduce((settings, valueKey) => {
				if (deepEqual(this.sourceData[valueKey].value, value[valueKey])) {
					return settings;
				}

				settings[valueKey] = value[valueKey];
				return settings;
			}.bind(this), {}); 

			this.props.onSave(changedSettingArray).catch(this._handleError);
		}

		return Promise.reject();
	},

	getFieldOptions(optionsObject, settingKey) {
		const sourceItem = this.sourceData[settingKey];

		const autoDetected = sourceItem.auto && sourceItem.value === this.state.formValue[settingKey];
		const legend = sourceItem.title + (autoDetected ? ' (auto detected)' : '');

		const fieldOptions = {
			legend: legend,
		};

		if (autoDetected && this.props.disableAutoDetected) {
			fieldOptions['disabled'] = true;
		}

		// Enum select field?
		if (sourceItem.values) {
			Object.assign(fieldOptions, {
				factory: t.form.Select,
				options: sourceItem.values,
				nullOption: false,
			});

			// Integer keys won't work, use string conversion
			if (sourceItem.value === parseInt(sourceItem.value, 10)) {
				fieldOptions['transformer'] = {
					format: v => String(v),
					parse: v => parseInt(v, 10)
				};
			}
		}

		// Let the parents add their own settings
		if (this.props.onFieldSetting) {
			this.props.onFieldSetting(settingKey, fieldOptions, this.state.formValue);
		}

		optionsObject[settingKey] = fieldOptions;
		return optionsObject;
	},

	render: function () {
		if (!this.sourceData) {
			return <div className="ui active text loader">Loading</div>;
		}

		const options = {};
		options['fields'] = Object.keys(this.sourceData).reduce(this.getFieldOptions, {});

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
				<TcombForm
					ref="form"
					type={t.struct(this.props.formItems)}
					options={options}
					value={this.state.formValue}
					onChange={this.onChange}
				/>
			</div>);
	}
});

export default Form;