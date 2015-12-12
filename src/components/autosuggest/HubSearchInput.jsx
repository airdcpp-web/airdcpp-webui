import React from 'react';
import SocketService from 'services/SocketService';
import RecentHubConstants from 'constants/RecentHubConstants';

import Autosuggest from 'react-autosuggest';
import SuggestionRenderer from './SuggestionRenderer';
import Button from 'components/semantic/Button';

const HubSearchInput = React.createClass({
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
		return suggestionObj.hub_url;
	},

	_getSuggestions(input, callback) {
		SocketService.post(RecentHubConstants.RECENT_HUB_SEARCH_URL, { pattern: this.state.text, max_results: 7 })
			.then(data => {
				callback(null, data || []);
			})
			.catch(error => 
				callback(new Error('Failed to fetch hubs: ' + error))
			);
	},

	_renderSuggestion(suggestionObj, input) {
		return SuggestionRenderer(input, suggestionObj.name, suggestionObj.hub_url);
	},

	_handleChange(value) {
		this.setState({ 
			text: value,
		});
	},

	_onSuggestionSelected(suggestionObj) {
		this.props.submitHandler(suggestionObj.hub_url);
	},

	_onClickConnect() {
		const { text } = this.state;
		this.props.submitHandler(text);
	},

	render() {
		const inputAttributes = {
			placeholder: 'Enter hub address...',
			onChange: this._handleChange,
			autoFocus: this.props.autoFocus,
		};

		return (
			<div className="ui fluid action input" onKeyDown={this._onKeyDown}>
				<Autosuggest 
					value={this.state.text}
					suggestions={this._getSuggestions}
					inputAttributes={inputAttributes}
					onSuggestionSelected={ this._onSuggestionSelected } 
					suggestionRenderer={ this._renderSuggestion }
					suggestionValue={ this._getSuggestionValue }
				/>

				<Button
					icon="green play"
					onClick={this._onClickConnect}
					caption="Connect"
				/>
			</div>
		);
	},
});

export default HubSearchInput;
