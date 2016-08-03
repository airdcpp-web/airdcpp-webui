import React from 'react';
import Modal from 'components/semantic/Modal';

import SearchConstants from 'constants/SearchConstants';

import SocketService from 'services/SocketService';
import { LocationContext, RouteContext } from 'mixins/RouterMixin';

import { FileIcon } from 'utils/IconFormat';
import IconConstants from 'constants/IconConstants';

import Loader from 'components/semantic/Loader';
import Message from 'components/semantic/Message';

import ResultInfoGrid from './ResultInfoGrid';
import UserResultTable from './UserResultTable';


const ResultDialog = React.createClass({
	mixins: [ LocationContext, RouteContext ],

	getInitialState() {
		return {
			results: [],
		};
	},

	componentDidMount() {
		this.fetchResults();
	},

	onResultsReceived(data) {
		this.setState({
			results: data,
		});
	},

	onResultsFailed(error) {
		this.setState({
			error
		});
	},

	fetchResults() {
		SocketService.get(SearchConstants.RESULT_URL + '/' + this.props.parentResult.id + '/children')
			.then(this.onResultsReceived)
			.catch(this.onResultsFailed);
	},

	render: function () {
		if (!this.state.results) {
			return <Loader/>;
		}

		const { parentResult } = this.props;
		return (
			<Modal 
				className="result" 
				title={ parentResult.name }
				closable={ true } 
				icon={ <FileIcon typeInfo={ parentResult.type }/> } 
				fullHeight={ true }
				{...this.props}
			>
				<ResultInfoGrid parentResult={ parentResult }/>
				{ this.state.error ? (
						<Message 
							title="Failed to load user listing"
							icon={ IconConstants.ERROR }
							description={ this.state.error.message }
						/>
					) : (
						<UserResultTable results={ this.state.results }/>
					)
				}
			</Modal>
		);
	}
});

export default ResultDialog;