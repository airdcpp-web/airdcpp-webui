import React from 'react';
import Promise from 'utils/Promise';

import NotificationActions from 'actions/NotificationActions';
import Loader from 'components/semantic/Loader';

import deepEqual from 'deep-equal';

import t from 'utils/tcomb-form';
import './style.css';

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
		 * The function may return a promise containing new setting objects to be set as user selections
		 */
		onChange: React.PropTypes.func,

		/**
		 * Optional callback that is called when the settings are received from the server
		 * Receives the setting object as parameter
		 */
		onSourceDataChanged: React.PropTypes.func,

		/**
		 * Source value to use for initial data
		 */
		sourceData: React.PropTypes.object,

		/**
		 * Header for the form
		 */
		title: React.PropTypes.node,

		/**
		 * Default values to set for the form if there is no current value
		 * Format: key: value
		 */
		defaultValues: React.PropTypes.object,
	},

	getDefaultProps() {
		return {
			defaultValues: {},
		};
	},

	getInitialState() {
		return {
			error: null,
			formValue: null
		};
	},

	setSourceData(sourceData) {
		const formValue = this.getValueMap(sourceData);

		if (this.props.onSourceDataChanged) {
			this.props.onSourceDataChanged(sourceData);
		}

		this.sourceData = sourceData;
		this.setState({ formValue: formValue });
	},

	componentWillMount() {
		if (this.props.sourceData) {
			this.setSourceData(this.props.sourceData);
		}
	},

	componentWillReceiveProps(nextProps) {
		if (nextProps.sourceData !== this.props.sourceData) {
			this.setSourceData(nextProps.sourceData);
		}
	},

	// Convert received settings to key-value map
	getValueMap(sourceData) {
		// Convert empty strings to nulls (that's what tcomb will use)
		for (let key in sourceData) {
			if (sourceData[key].value === '') {
				sourceData[key].value = null;
			}
		}

		// Get a simple key-value map for the form
		return Object.keys(sourceData).reduce((valueMap, key) => {
			// Use the default value if there is nothing set
			if (!sourceData[key].value && this.props.defaultValues[key]) {
				valueMap[key] = this.props.defaultValues[key];
			} else {
				valueMap[key] = sourceData[key].value;
			}

			return valueMap;
		}, {});
	},

	// Merge new settings to current values (don't change source data)
	onUserSettingsReceived(formValue, data) {
		const newValue = Object.assign({}, formValue, this.getValueMap(data));

		this.setState({ formValue: newValue });
	},

	onFieldChanged(value, valueKey) {
		// Make sure that we have the converted value for the custom 
		// change handler (in case there are transforms for this field)
		const result = this.refs.form.getComponent(valueKey).validate();
		const key = valueKey[0];
		value[key] = result.value;

		if (this.props.onFieldChanged) {
			const promise = this.props.onFieldChanged(key, value, !deepEqual(this.sourceData[key].value, value[key]));
			if (promise) {
				promise
					.then(this.onUserSettingsReceived.bind(this, value))
					.catch(error => 
						NotificationActions.apiError('Failed to update values', error)
					);
			}
		}

		this.setState({ 
			formValue: value 
		});
	},

	// Handle an API error
	_handleError(error) {
		if (error.code === 422) {
			this.setState({ error: error.json });
		} else {
			NotificationActions.apiError('Failed to save the form', error);
		}

		throw error;
	},

	// Reduces an object of current form values that don't match the source data
	reduceChangedValues(formValue, changedValues, valueKey) {
		if (!deepEqual(this.sourceData[valueKey].value, formValue[valueKey])) {
			changedValues[valueKey] = formValue[valueKey];
		}

		return changedValues;
	},

	// Calls props.onSave with changed form values
	save() {
		let validatedFormValue = this.refs.form.getValue();
		if (validatedFormValue) {

			// Filter the changed settings
			const settingKeys = Object.keys(validatedFormValue);
			const changedSettingArray = settingKeys.reduce(
				this.reduceChangedValues.bind(this, validatedFormValue), 
				{}
			); 

			return this.props.onSave(changedSettingArray).catch(this._handleError);
		}

		return Promise.reject(new Error('Validation failed'));
	},

	// Reduces an array of field setting objects by calling props.onFieldSetting
	fieldOptionReducer(optionsObject, settingKey) {
		if (this.props.onFieldSetting) {
			optionsObject[settingKey] = {};
			this.props.onFieldSetting(settingKey, optionsObject[settingKey], this.state.formValue, this.sourceData);
		}

		return optionsObject;
	},

	// Returns an options object for Tcomb form
	getFieldOptions() {
		const options = {};
		options['fields'] = Object.keys(this.sourceData).reduce(this.fieldOptionReducer, {});

		// Do we have an error object from the API?
		// Show the error message for the respective field
		const { error } = this.state;
		if (error) {
			options.fields[error.field] = options.fields[error.field] || {};
			Object.assign(options.fields[error.field], {
				error: error.message,
				hasError: true
			});
		}

		return options;
	},

	render: function () {
		if (!this.sourceData) {
			return <Loader text="Loading form data"/>;
		}

		let formHeader = null;
		if (this.props.title) {
			formHeader = (
				<div className="ui form header">
					{ this.props.title } 
				</div>
			);
		}

		return (
			<div className="form">
				{ formHeader }
				<TcombForm
					ref="form"
					type={ t.struct(this.props.formItems) }
					options={ this.getFieldOptions() }
					value={ this.state.formValue }
					onChange={ this.onFieldChanged }
					context={ this.props.context }
				/>
			</div>);
	}
});

export default Form;