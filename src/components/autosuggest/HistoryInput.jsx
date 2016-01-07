import React from 'react';
import SocketService from 'services/SocketService';
import HistoryConstants from 'constants/HistoryConstants';

import HistoryActions from 'actions/HistoryActions';

import LocalSuggestField from './LocalSuggestField';
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

	componentDidMount() {
		this.loadHistory();
	},

	loadHistory() {
		SocketService.get(HistoryConstants.ITEMS_URL + '/' + this.props.historyId)
			.then(data => {
				this.setState({ history: data });
			})
			.catch(error => 
				console.error('Failed to load history: ' + error)
			);
	},

	handleSubmit() {
		const { text } = this.state;

		HistoryActions.add(this.props.historyId, text);

		this.loadHistory();
		this.props.submitHandler(text);
	},

	render() {
		return (
			<div className="ui fluid action input">
				<LocalSuggestField 
					data={ this.state.history }
					placeholder="Enter search string..."
					submitHandler={ this.handleSubmit }
					onChange={ value => this.setState({ text: value }) }
				/>

				<Button
					icon="search icon"
					onClick={ this.handleSubmit }
					caption="Search"
					disabled={ this.state.text.length === 0 }
					loading={ this.props.running }
				/>
			</div>
		);
	},
});
