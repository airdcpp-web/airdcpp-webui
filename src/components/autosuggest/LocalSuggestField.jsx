import React from 'react';

//import Autosuggest from 'react-autosuggest';
import SuggestionRenderer from './SuggestionRenderer';
import SuggestField from './SuggestField';

export default React.createClass({
	propTypes: {
		data: React.PropTypes.array.isRequired,

		onChange: React.PropTypes.func,
	},

	getInitialState() {
		return {
			suggestions: [],
		};
	},

	filterSuggestions(text) {
		const regex = new RegExp('^' + text, 'i');
		return this.props.data.filter(str => regex.test(str));
	},

	onTextChange(newValue, typed) {
		if (this.props.onChange) {
			this.props.onChange(newValue);
		}

		if (!typed) {
			return;
		}

		this.setState({ 
			suggestions: newValue ? this.filterSuggestions(newValue) : [],
		});
	},

	renderSuggestion(dataItem, { value }) {
		return SuggestionRenderer(value, dataItem);
	},

	getSuggestionValue(suggestion) {
		return suggestion;
	},

	render() {
		return (
			<SuggestField 
				{ ...this.props }
				renderSuggestion={ this.renderSuggestion }
				getSuggestionValue={ this.getSuggestionValue }
				suggestions={ this.state.suggestions }
				onChange={ this.onTextChange }
			/>
		);
	},
});
