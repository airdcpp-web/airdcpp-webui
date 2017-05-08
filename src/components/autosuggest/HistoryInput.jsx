import PropTypes from 'prop-types';
import React from 'react';
import SocketService from 'services/SocketService';
import HistoryConstants from 'constants/HistoryConstants';

import HistoryActions from 'actions/HistoryActions';

import LocalSuggestField from './LocalSuggestField';


export default React.createClass({
	propTypes: {

		/**
		 * ID of the history section
		 */
		historyId: PropTypes.string.isRequired,
	},

	getInitialState() {
		return {
			history: [],
		};
	},

	componentDidMount() {
		this.loadHistory();
	},

	loadHistory() {
		SocketService.get(HistoryConstants.STRINGS_URL + '/' + this.props.historyId)
			.then(data => {
				this.setState({ history: data });
			})
			.catch(error => 
				console.error('Failed to load history: ' + error)
			);
	},

	handleSubmit(text) {
		HistoryActions.add(this.props.historyId, text);

		this.loadHistory();
		this.props.submitHandler(text);
	},

	render() {
		return (
			<LocalSuggestField 
				{ ...this.props }
				data={ this.state.history }
				submitHandler={ this.handleSubmit }
			/>
		);
	},
});
