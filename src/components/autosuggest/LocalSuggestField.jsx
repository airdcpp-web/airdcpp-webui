import React from 'react';

import Autosuggest from 'react-autosuggest';
import SuggestionRenderer from './SuggestionRenderer';


export default React.createClass({
	propTypes: {

		/**
		 * Function to call when pressing enter
		 */
		submitHandler: React.PropTypes.func,

		data: React.PropTypes.array.isRequired,

		placeholder: React.PropTypes.string,

		onChange: React.PropTypes.func,

		initialValue: React.PropTypes.string,
	},

	getInitialState() {
		return {
			suggestions: [],
			text: this.props.initialValue,
		};
	},

	getDefaultProps() {
		return {
			autoFocus: true,
			initialValue: '',
		};
	},

	handleSubmit() {
		if (this.props.submitHandler) {
			this.props.submitHandler(this.state.text);
		}
	},

	filterSuggestions(text) {
		const regex = new RegExp('^' + text, 'i');
		return this.props.data.filter(str => regex.test(str));
	},

	onTextChange(evt, { newValue, method }) {
		if (method !== 'type') {
			this.setState({ text: newValue });
			return;
		}

		if (this.props.onChange) {
			this.props.onChange(newValue);
		}

		this.setState({ 
			text: newValue,
			suggestions: this.filterSuggestions(newValue),
		});
	},

	isSubmitDisabled() {
		return this.state.text.length === 0;
	},

	renderSuggestion(dataItem, { value }) {
		return SuggestionRenderer(value, dataItem);
	},

	getSuggestionValue(suggestion) {
		return suggestion;
	},

	onKeyDown: function (event) {
		if (event.keyCode === 13 && this.state.text.length !== 0) {
			// Hide the suggestion menu
			this.setState({ suggestions: [] });
			
			this.handleSubmit();
		}
	},

	render() {
		const inputAttributes = {
			placeholder: this.props.placeholder,
			onChange: this.onTextChange,
			autoFocus: this.props.autoFocus,
			value: this.state.text,
			onKeyDown: this.onKeyDown,
		};

		return (
			<Autosuggest 
				renderSuggestion={ this.renderSuggestion }
				getSuggestionValue={ this.getSuggestionValue }
				suggestions={ this.state.suggestions }
				inputProps={ inputAttributes } 
				onSuggestionSelected={ this.handleSubmit }
			/>
		);
	},
});
