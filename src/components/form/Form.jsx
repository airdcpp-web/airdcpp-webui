import React from 'react';
import classNames from 'classnames';
import isEqual from 'lodash/isEqual';

import NotificationActions from 'actions/NotificationActions';

import FormUtils from 'utils/FormUtils';
import t from 'utils/tcomb-form';

import './style.css';

const TcombForm = t.form.Form;

const Form = React.createClass({
	propTypes: {
		/**
		 * Form items to list
		 */
		fieldDefinitions: React.PropTypes.array.isRequired,

		/**
		 * Optional callback for appending field settings
		 * Receives the field key, field definitions and the current form value as parameters
		 */
		onFieldSetting: React.PropTypes.func,

		/**
		 * Called when the form is saved
		 * Receives the changed fields as parameter
		 * Must return promise
		 */
		onSave: React.PropTypes.func.isRequired,

		/**
		 * Optional callback that is called when a field value was changed
		 * Receives the field key, current form value value and boolean whether the field value is different from the source value
		 * The function may return a promise containing new setting objects to be set as user selections
		 */
		onFieldChanged: React.PropTypes.func,

		/**
		 * Optional callback that is called when the settings are received from the server
		 * Receives the new source value object as parameter
		 */
		onSourceValueUpdated: React.PropTypes.func,

		/**
		 * Source value to use for initial data
		 * If no value is provided, the initial value is initialized
		 * with defaultValue from definitions
		 */
		value: React.PropTypes.object,

		/**
		 * Header for the form
		 */
		title: React.PropTypes.node,
	},

	contextTypes: {
		onFieldChanged: React.PropTypes.func,
	},

	getInitialState() {
		return {
			error: null,
			formValue: {},
		};
	},

	setSourceValue(value) {
		this.sourceValue = this.mergeFields(this.state.formValue, value);

		if (this.props.onSourceValueUpdated) {
			this.props.onSourceValueUpdated(this.sourceValue);
		}
	},

	componentWillMount() {
		this.setSourceValue(this.props.value);
	},

	componentWillReceiveProps(nextProps) {
		if (nextProps.value !== this.props.value) {
			this.setSourceValue(nextProps.value);
		}
	},

	// Merge new fields into current current form value
	mergeFields(formValue, updatedFields) {
		const mergedValue = {
			...formValue, 
			...FormUtils.normalizeValue(updatedFields, this.props.fieldDefinitions)
		};

		this.setState({ 
			formValue: mergedValue 
		});

		return mergedValue;
	},

	onFieldChanged(value, valueKey, kind) {
		const key = valueKey[0];
		if (kind) {
			// List action
			if (kind === 'add') {
				// Set default fields
				const fieldDef = this.props.fieldDefinitions.find(def => def.key === key);
				value[key][valueKey[1]] = FormUtils.normalizeValue(value[key][valueKey[1]], fieldDef.value_definitions);
			}
		} else {
			// Make sure that we have the converted value for the custom 
			// change handler (in case there are transforms for this field)
			const result = this.form.getComponent(valueKey[0]).validate();
			value[key] = result.value;

			if (this.props.onFieldChanged) {
				const promise = this.props.onFieldChanged(key, value, !isEqual(this.sourceValue[key], value[key]));
				if (promise) {
					promise.then(this.mergeFields.bind(this, value), error => NotificationActions.apiError('Failed to update values', error));
				}
			}

			if (this.context.onFieldChanged) {
				this.context.onFieldChanged(key, value, !isEqual(this.sourceValue[key], value[key]));
			}
		}

		this.setState({ 
			formValue: value 
		});
	},

	// Handle an API error
	onSaveFailed(error) {
		if (error.code === 422) {
			this.setState({ error: error.json });
		} else {
			NotificationActions.apiError('Failed to save the form', error);
		}

		throw error;
	},

	// Reduces an object of current form values that don't match the source data
	reduceChangedValues(formValue, changedValues, valueKey) {
		if (!isEqual(this.sourceValue[valueKey], formValue[valueKey])) {
			changedValues[valueKey] = formValue[valueKey];
		}

		return changedValues;
	},

	// Calls props.onSave with changed form values
	save() {
		const validatedFormValue = this.form.getValue();
		if (validatedFormValue) {
			// Get the changed fields
			const settingKeys = Object.keys(validatedFormValue);
			const changedFields = settingKeys.reduce(
				this.reduceChangedValues.bind(this, validatedFormValue), 
				{}
			); 

			return this.props.onSave(changedFields, validatedFormValue).catch(this.onSaveFailed);
		}

		return Promise.reject(new Error('Validation failed'));
	},

	// Reduces an array of field setting objects by calling props.onFieldSetting
	fieldOptionReducer(optionsObject, def) {
		optionsObject[def.key] = FormUtils.parseFieldOptions(def);

		if (this.props.onFieldSetting) {
			this.props.onFieldSetting(def.key, optionsObject[def.key], this.state.formValue);
		}

		if (def.value_definitions) {
			optionsObject[def.key]['item'] = {};
			optionsObject[def.key]['item']['fields'] = def.value_definitions.reduce(this.fieldOptionReducer, {});
		}

		return optionsObject;
	},

	// Returns an options object for Tcomb form
	getFieldOptions() {
		const options = {};

		// Parent handlers
		options['fields'] = this.props.fieldDefinitions.reduce(this.fieldOptionReducer, {});

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
		const { title, context, fieldDefinitions, className } = this.props;
		const { formValue } = this.state;
		return (
			<div className={ classNames('form', className) }>
				{ title && (
					<div className="ui form header">
						{ title } 
					</div>
				) }
				<TcombForm
					ref={ c => this.form = c }
					type={ FormUtils.parseDefinitions(fieldDefinitions) }
					options={ this.getFieldOptions() }
					value={ formValue }
					onChange={ this.onFieldChanged }
					context={ context }
				/>
			</div>);
	}
});

export default Form;