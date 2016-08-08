import React from 'react';

import SocketService from 'services/SocketService';

import SuggestField from './SuggestField';
import SuggestionRenderer from './SuggestionRenderer';


const RemoteSuggestField = React.createClass({
	propTypes: {
		valueField: React.PropTypes.string.isRequired,

		descriptionField: React.PropTypes.string.isRequired,

		url: React.PropTypes.string.isRequired,
	},

	getInitialState() {
		return {
			suggestions: [],
		};
	},

	getSuggestionValue(suggestionObj) {
		return suggestionObj[this.props.valueField];
	},

	onTextChanged(pattern, typed) {
		if (!pattern || !typed) {
			return;
		}

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

	renderSuggestion(suggestionObj, { query }) {
		return SuggestionRenderer(query, suggestionObj[this.props.valueField], suggestionObj[this.props.descriptionField]);
	},

	render() {
		return (
			<SuggestField 
				{ ...this.props }
				suggestions={ this.state.suggestions }
				renderSuggestion={ this.renderSuggestion }
				getSuggestionValue={ this.getSuggestionValue }
				onChange={ this.onTextChanged }
			/>
		);
	},
});

export default RemoteSuggestField;
