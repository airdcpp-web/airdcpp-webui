import React from 'react';
import Modal from 'components/semantic/Modal';

import SearchConstants from 'constants/SearchConstants';
import IconConstants from 'constants/IconConstants';

import SocketService from 'services/SocketService';
import { LocationContext, RouteContext } from 'mixins/RouterMixin';

import { IpFormatter } from 'utils/IconFormat';
import ValueFormat from 'utils/ValueFormat';

import Loader from 'components/semantic/Loader';

import { UserMenu } from 'components/menu/DropdownMenu';


const Result = ({ result }) => {
	//const isFile = result.type.id === 'file';
	return (
		<tr>
			<td>
				<UserMenu 
					//contextGetter={ dropdownContextGetter } 
					//triggerIcon={null} 
					//noIcon={true} 
					user={ result.users.user }
					directory={ result.path }
				/>
			</td>
			<td>
				{ ValueFormat.formatConnection(result.connection) }
			</td>
			<td>
				{ result.slots.str }
			</td>
			<td>
				<IpFormatter item={ result.ip }/>
			</td>
			<td>
				{ result.path }
			</td>
		</tr>
	);
};

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

	fetchResults() {
		SocketService.get(SearchConstants.RESULT_URL + '/' + this.props.parentResult.id + '/children')
			.then(this.onResultsReceived)
			.catch(error => 
				console.error('Failed to load results: ' + error)
			);
	},

	render: function () {
		if (!this.state.results) {
			return <Loader/>;
		}

		return (
			<Modal 
				className="result" 
				title={ 'Search results for ' + this.props.parentResult.name }
				closable={ true } 
				icon={ IconConstants.SEARCH } 
				{...this.props}
			>
				<table className="ui striped compact table">
					<thead>
						<tr>
							<th>User</th>
							<th>Connection</th>
							<th>Slots</th>
							<th>IP</th>
							<th>Path</th>
						</tr>
					</thead>
					<tbody>
						{ this.state.results.map(result => 
							<Result 
								key={ result.id }
								result={ result }
								//itemClickHandler={ this.props.itemClickHandler }
							/>) }
					</tbody>
				</table>
			</Modal>
		);
	}
});

export default ResultDialog;