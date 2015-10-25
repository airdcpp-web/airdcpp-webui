import React from 'react';
import SocketService from 'services/SocketService.js';
import { RECENT_HUB_SEARCH_URL } from 'constants/RecentHubConstants.js';
import Autosuggest from 'react-autosuggest';
import classNames from 'classnames';
import SuggestionRenderer from './SuggestionRenderer';

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
		SocketService.post(RECENT_HUB_SEARCH_URL, { pattern: this.state.text, max_results: 7 })
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

		const buttonClass = classNames(
			'ui', 
			'button',
		);

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

				<button onClick={ this._onClickConnect } className={ buttonClass }>
					<i className="green play"></i>
					Connect
				</button>
			</div>
		);
	},
});

export default HubSearchInput;
