import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';

import Autosuggest from 'react-autosuggest';


const SuggestField = React.createClass({
	propTypes: {

		/**
		 * Function to call when selecting suggestions
		 * Receives the suggestion value and the suggestion object (only if selecting a suggestion)
		 */
		submitHandler: PropTypes.func,

		/**
		 * Function to call when the input text was changed
		 */
		onChange: PropTypes.func,

		/**
		 * Providing a button element makes the input accept custom inputs when pressing enter
		 * The same submitHandler is called but without suggestion object
		 */
		button: PropTypes.element,

		placeholder: PropTypes.string,

		/**
		 * Default input value to show
		 * The input will also be updated accordingly when a different stored value is received
		 */
		storedValue: PropTypes.string,

		/**
		 * Disables the field action button
		 */
		disabled: PropTypes.bool,
	},

	getInitialState() {
		return {
			text: this.props.storedValue,
		};
	},

	getDefaultProps() {
		return {
			autoFocus: true,
			storedValue: '',
		};
	},

	componentWillReceiveProps(nextProps) {
		if (nextProps.storedValue !== this.props.storedValue) {
			this.setState({ text: nextProps.storedValue });
		}
	},

	handleSubmit(event, suggestion) {
		if (this.props.submitHandler) {
			const value = suggestion ? this.props.getSuggestionValue(suggestion) : this.state.text;
			this.props.submitHandler(value, suggestion);
		}
	},

	onTextChange(evt, { newValue }) {
		this.setState({ 
			text: newValue 
		});

		if (this.props.onChange) {
			this.props.onChange(newValue);
		}
	},

	isSubmitDisabled() {
		return this.state.text.length === 0;
	},

	getSuggestionValue(suggestion) {
		return suggestion;
	},

	onKeyDown: function (event) {
		// Accept custom inputs only when there's a submit button
		if (!this.props.button || this.isSubmitDisabled()) {
			return;
		}

		if (event.keyCode === 13 && !event.isDefaultPrevented()) {
			// Hide the suggestion menu
			this.props.onSuggestionsClearRequested();

			this.handleSubmit(event);
		}
	},

	onSuggestionSelected(event, { suggestion, suggestionValue, method }) {
		// No second 'Enter' event if the suggestion was selected
		event.preventDefault();

		this.handleSubmit(event, suggestion);
	},

	render() {
		const { className, autoFocus, placeholder, button, ...other } = this.props;

		const inputAttributes = {
			placeholder: placeholder,
			onChange: this.onTextChange,
			autoFocus: autoFocus,
			value: this.state.text,
			onKeyDown: this.onKeyDown,
		};

		const suggestField = (
			<Autosuggest 
				{ ...other }
				initialValue={ this.props.storedValue }
				inputProps={ inputAttributes } 
				onSuggestionSelected={ this.onSuggestionSelected }
			/>
		);

		const fieldStyle = classNames(
			'ui fluid input',
			{ 'action': button },
			className,
		);

		if (button) {
			return (
				<div className={ fieldStyle }>
					{ suggestField }
					{ React.cloneElement(button, {
						onClick: evt => this.handleSubmit(evt),
						disabled: this.isSubmitDisabled() || this.props.disabled,
					}) }
				</div>
			);
		}

		return (
			<div className={ fieldStyle }>
				{ suggestField }
			</div>
		);
	},
});

export default SuggestField;