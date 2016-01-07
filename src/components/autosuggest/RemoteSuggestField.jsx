import React from 'react';

import SocketService from 'services/SocketService';

import Autosuggest from 'react-autosuggest';
import SuggestionRenderer from './SuggestionRenderer';


const RemoteSuggestField = React.createClass({
	propTypes: {

		/**
		 * Function to call when pressing enter
		 */
		submitHandler: React.PropTypes.func.isRequired,

		onChange: React.PropTypes.func,

		valueField: React.PropTypes.string.isRequired,

		descriptionField: React.PropTypes.string.isRequired,

		url: React.PropTypes.string.isRequired,

		placeholder: React.PropTypes.string.isRequired,
	},

	getInitialState() {
		return {
			text:'',
			suggestions: [],
		};
	},

	getDefaultProps() {
		return {
			autoFocus: true,
		};
	},

	getSuggestionValue(suggestionObj) {
		return suggestionObj[this.props.valueField];
	},

	updateSuggestions(pattern) {
		SocketService.post(this.props.url, { 
			pattern, 
			max_results: 7 
		})
			.then(this.onSuggestionsReceived)
			.catch(error => 
				console.log('Failed to fetch nicks: ' + error)
			);
	},

	onSuggestionsReceived(data) {
		this.setState({ suggestions: data });
	},

	renderSuggestion(suggestionObj, { value }) {
		return SuggestionRenderer(value, suggestionObj[this.props.valueField], suggestionObj[this.props.descriptionField]);
	},

	onTextChange(evt, { newValue, method }) {
		this.setState({ text: newValue });
		if (this.props.onChange) {
			this.props.onChange(newValue);
		}

		if (method === 'type') {
			this.updateSuggestions(newValue);
		}
	},

	onSuggestionSelected(evt, { suggestion, suggestionValue, method }) {
		this.props.submitHandler(suggestion, suggestionValue);
	},

	render() {
		const inputAttributes = {
			placeholder: this.props.placeholder,
			onChange: this.onTextChange,
			autoFocus: this.props.autoFocus,
			value: this.state.text,
		};

		return (
			<Autosuggest 
				suggestions={ this.state.suggestions }
				inputProps={ inputAttributes }
				onSuggestionSelected={ this.onSuggestionSelected } 
				renderSuggestion={ this.renderSuggestion }
				getSuggestionValue={ this.getSuggestionValue }
			/>
		);
	},
});

export default RemoteSuggestField;
