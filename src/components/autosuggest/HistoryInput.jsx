import React from 'react';
import SocketService from 'services/SocketService.js';
import { HISTORY_ITEM_URL, HISTORY_ITEMS_URL } from 'constants/HistoryConstants.js';

import Autosuggest from 'react-autosuggest';
import Button from 'components/semantic/Button';

export default React.createClass({
	propTypes: {

		/**
		 * Function to call when pressing enter
		 */
		submitHandler: React.PropTypes.func.isRequired,

		/**
		 * ID of the history section
		 */
		historyId: React.PropTypes.number.isRequired,
	},

	getInitialState() {
		return {
			history: [],
			text:'',
		};
	},

	getDefaultProps() {
		return {
			autoFocus: true,
		};
	},

	componentDidMount() {
		this._loadHistory();
	},

	_loadHistory() {
		SocketService.get(HISTORY_ITEMS_URL + '/' + this.props.historyId)
			.then(data => {
				this.setState({ history: data });
			})
			.catch(error => 
				console.error('Failed to load history: ' + error)
			);
	},

	_onKeyDown: function (event) {
		if (event.keyCode === 13) {
			if (!this._isDisabled()) {
				this._handleSubmit();
			}
		}
	},

	_handleSubmit() {
		const { text } = this.state;
		SocketService.post(HISTORY_ITEM_URL + '/' + this.props.historyId, { item: text })
			.then(data => {
			})
			.catch(error => 
				console.error('Failed to post history: ' + error)
			);
		console.log('Searching');
		this.setState({ 
			suggestionsActive: false,
		});

		this._loadHistory();
		this.props.submitHandler(text);
	},

	_getSuggestions(input, callback) {
		const regex = new RegExp('^' + input, 'i');
		const suggestions = this.state.history.filter(str => regex.test(str));

		callback(null, suggestions);
	},

	_handleChange(value) {
		this.setState({ 
			text: value,
			suggestionsActive: true,
		});
	},

	// Hide suggestions after submitting input
	_showWhen(input) {
		return input.trim().length > 0 && this.state.suggestionsActive;
	},

	_isDisabled() {
		return this.state.text.length === 0;
	},

	render() {
		const inputAttributes = {
			placeholder: 'Enter search string...',
			onChange: this._handleChange,
			autoFocus: this.props.autoFocus,
		};

		return (
			<div className="ui fluid action input" onKeyDown={this._onKeyDown}>
				<Autosuggest 
					value={this.state.text}
					showWhen={this._showWhen}
					suggestions={this._getSuggestions}
					inputAttributes={inputAttributes} 
				/>

				<Button
					icon="search icon"
					onClick={this._handleSubmit}
					caption="Search"
					disabled={this._isDisabled()}
					loading={this.props.running}
				/>
			</div>
		);
	},
});
