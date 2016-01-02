import React from 'react';

import SocketService from 'services/SocketService';
import HubConstants from 'constants/HubConstants';

import Autosuggest from 'react-autosuggest';
import SuggestionRenderer from './SuggestionRenderer';
import OfflineHubMessageDecorator from 'decorators/OfflineHubMessageDecorator';


const UserSearchInput = React.createClass({
	propTypes: {

		/**
		 * Function to call when pressing enter
		 */
		submitHandler: React.PropTypes.func.isRequired,
	},

	getInitialState() {
		return {
			text:'',
		};
	},

	getDefaultProps() {
		return {
			autoFocus: true,
		};
	},

	_getSuggestionValue(suggestionObj) {
		return suggestionObj.nick;
	},

	_getSuggestions(input, callback) {
		SocketService.post(HubConstants.SEARCH_NICKS_URL, { pattern: this.state.text, max_results: 7 })
			.then(data => {
				callback(null, data || []);
			})
			.catch(error => 
				callback(new Error('Failed to fetch nicks: ' + error))
			);
	},

	_renderSuggestion(suggestionObj, input) {
		return SuggestionRenderer(input, this._getSuggestionValue(suggestionObj), suggestionObj.hub_name);
	},

	_handleChange(value) {
		this.setState({ text: value });
	},

	render() {
		const inputAttributes = {
			placeholder: 'Enter nick...',
			onChange: this._handleChange,
			autoFocus: this.props.autoFocus,
		};

		return (
			<OfflineHubMessageDecorator offlineMessage={this.props.offlineMessage}>
				<div className="ui fluid action input" onKeyDown={this._onKeyDown}>
					<Autosuggest 
						value={this.state.text}
						suggestions={this._getSuggestions}
						inputAttributes={inputAttributes}
						onSuggestionSelected={ this.props.submitHandler } 
						suggestionRenderer={ this._renderSuggestion }
						suggestionValue={ this._getSuggestionValue }
					/>
				</div>
			</OfflineHubMessageDecorator>
		);
	},
});

export default UserSearchInput;
