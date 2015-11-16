import React from 'react';
import SocketService from 'services/SocketService';
import { HistoryEnum } from 'constants/HistoryConstants';
import { SEARCH_QUERY_URL } from 'constants/SearchConstants';

import HistoryInput from 'components/autosuggest/HistoryInput';

import OfflineHubMessageDecorator from 'decorators/OfflineHubMessageDecorator';

//import Message from 'components/semantic/Message';

import '../style.css';
import ResultTable from './ResultTable';

const SEARCH_PERIOD = 4000;

const Search = React.createClass({
	_handleSearch(text) {
		console.log('Searching');

		clearTimeout(this._searchTimeout);

		SocketService.post(SEARCH_QUERY_URL, { pattern: text })
			.then(this.onSearchPosted)
			.catch(error => 
				console.error('Failed to post search: ' + error)
			);

		this.setState({
			searchString: text,
			running: true 
		});
	},

	onSearchPosted(data) {
		this._searchTimeout = setTimeout(() => this.setState({ running:false }), data.queue_time + SEARCH_PERIOD);
	},

	getInitialState() {
		return {
			searchString: null,
			running: false
		};
	},

	render() {
		return (
			<OfflineHubMessageDecorator offlineMessage="You must to be connected to at least one hub in order to perform searches">
				<div className="search-layout full-height">
					<div className="search-container">
						<div className="search-area">
							<HistoryInput historyId={HistoryEnum.HISTORY_SEARCH} submitHandler={this._handleSearch} running={this.state.running}/>
						</div>
					</div>
					<ResultTable 
						searchString={this.state.searchString} 
						running={this.state.running}
						location={this.props.location}
					/>
				</div>
			</OfflineHubMessageDecorator>
		);
	}
});

export default Search;
