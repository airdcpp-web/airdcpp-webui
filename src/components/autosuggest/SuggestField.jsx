import React from 'react';
import classNames from 'classnames';

import Autosuggest from 'react-autosuggest';


const SuggestField = React.createClass({
	propTypes: {

		/**
		 * Function to call when selecting suggestions
		 * Receives the suggestion value and the suggestion object (only if selecting a suggestion)
		 */
		submitHandler: React.PropTypes.func,

		/**
		 * Function to call when the input text was changed
		 * Receives the new text as an argument (or null if the suggestion list should be cleared)
		 */
		onChange: React.PropTypes.func.isRequired,

		/**
		 * Providing a button element makes the input accept custom inputs when pressing enter
		 * The same submitHandler is called but without suggestion object
		 */
		button: React.PropTypes.element,

		placeholder: React.PropTypes.string,
		initialValue: React.PropTypes.string,
	},

	getInitialState() {
		return {
			suggestions: [],
			text: this.props.initialValue ? this.props.initialValue : '',
		};
	},

	getDefaultProps() {
		return {
			autoFocus: true,
		};
	},

	handleSubmit(event, suggestion) {
		if (this.props.submitHandler) {
			const value = suggestion ? this.props.getSuggestionValue(suggestion) : this.state.text;
			this.props.submitHandler(value, suggestion);
		}
	},

	onTextChange(evt, { newValue, method }) {
		this.setState({ text: newValue });
		if (method !== 'type') {
			return;
		}

		this.props.onChange(newValue);
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
			this.props.onChange(null);

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
				inputProps={ inputAttributes } 
				onSuggestionSelected={ this.onSuggestionSelected }
			/>
		);

		const fieldStyle = classNames(
			'ui fluid action input',
			{ 'action': button },
			className,
		);

		if (button) {
			return (
				<div className={ fieldStyle }>
					{ suggestField }
					{ React.cloneElement(button, {
						onClick: this.handleSubmit,
						disabled: this.isSubmitDisabled(),
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