import React from 'react';

import SuggestionRenderer from './SuggestionRenderer';
import SuggestField from './SuggestField';

import escapeStringRegexp from 'escape-string-regexp';


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
		const regex = new RegExp('^' + escapeStringRegexp(text), 'i');
		return this.props.data.filter(str => regex.test(str));
	},

	onSuggestionsFetchRequested({ value }) {
		this.setState({ 
			suggestions: this.filterSuggestions(value),
		});
	},

	onSuggestionsClearRequested() {
		this.setState({
			suggestions: []
		});
	},

	renderSuggestion(dataItem, { query }) {
		return SuggestionRenderer(query, dataItem);
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
				onChange={ this.props.onChange }
				onSuggestionsFetchRequested={ this.onSuggestionsFetchRequested }
				onSuggestionsClearRequested={ this.onSuggestionsClearRequested }
			/>
		);
	},
});
