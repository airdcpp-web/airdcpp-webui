import React from 'react';
import Promise from 'utils/Promise';

import NotificationActions from 'actions/NotificationActions';
import Loader from 'components/semantic/Loader';

import deepEqual from 'deep-equal';

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
	},

	getInitialState() {
		return {
			error: null,
			formValue: null
		};
	},

	componentWillReceiveProps(nextProps) {
		if (nextProps.sourceData !== this.props.sourceData) {
			const formValue = this.getValueMap(nextProps.sourceData);

			if (this.props.onSourceDataChanged) {
				this.props.onSourceDataChanged(nextProps.sourceData);
			}

			this.sourceData = nextProps.sourceData;
			this.setState({ formValue: formValue });
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
			valueMap[key] = sourceData[key].value;
			return valueMap;
		}, {});
	},

	// Merge new settings to current values (don't change source data)
	onUserSettingsReceived(formValue, data) {
		const newValue = Object.assign({}, formValue, this.getValueMap(data));

		this.setState({ formValue: newValue });
	},

	onFieldChanged(value, valueKey) {
		// Make sure that we have the converted value
		const result = this.refs.form.getComponent(valueKey).validate();
		value[valueKey] = result.value;

		if (this.props.onFieldChanged) {
			const promise = this.props.onFieldChanged(valueKey, value, !deepEqual(this.sourceData[valueKey].value, value[valueKey]));
			if (promise) {
				promise
					.then(this.onUserSettingsReceived.bind(this, value))
					.catch(error => 
						NotificationActions.apiError('Failed to update values', error)
					);
			}
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

			return this.props.onSave(changedSettingArray).catch(this._handleError);
		}

		return Promise.reject(new Error('Validation failed'));
	},

	getFieldOptions(optionsObject, settingKey) {
		if (this.props.onFieldSetting) {
			optionsObject[settingKey] = {};
			this.props.onFieldSetting(settingKey, optionsObject[settingKey], this.state.formValue, this.sourceData);
		}

		return optionsObject;
	},

	render: function () {
		if (!this.sourceData) {
			return <Loader/>;
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
			<div className="form">
				{ this.props.title ? <div className="ui header">{ this.props.title } </div> : null }
				<TcombForm
					ref="form"
					type={t.struct(this.props.formItems)}
					options={options}
					value={this.state.formValue}
					onChange={this.onFieldChanged}
				/>
			</div>);
	}
});

export default Form;