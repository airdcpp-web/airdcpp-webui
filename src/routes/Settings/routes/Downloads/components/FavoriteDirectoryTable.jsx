import React from 'react';
import ReactDOM from 'react-dom';

import FavoriteDirectoryActions from 'actions/FavoriteDirectoryActions';
import FavoriteDirectoryConstants from 'constants/FavoriteDirectoryConstants';

import ActionButton from 'components/ActionButton';
import Loader from 'components/semantic/Loader';
import Message from 'components/semantic/Message';

import IconConstants from 'constants/IconConstants';
import SocketService from 'services/SocketService';

import { ActionMenu } from 'components/menu/DropdownMenu';

import SocketSubscriptionMixin from 'mixins/SocketSubscriptionMixin';

//import '../style.css';


const Row = ({ directory }) => (
	<tr>
		<td>
			<ActionMenu 
				caption={ <strong>{ directory.name }</strong> } 
				actions={ FavoriteDirectoryActions } 
				ids={ [ 'edit', 'remove' ]} 
				itemData={ directory }
				contextGetter={ _ => '#setting-scroll-context' }
			/>
		</td>
		<td>
			{ directory.path }
		</td>
	</tr>
);

const FavoriteDirectoryPage = React.createClass({
	mixins: [ SocketSubscriptionMixin() ],
	onSocketConnected(addSocketListener) {
		addSocketListener(FavoriteDirectoryConstants.MODULE_URL, FavoriteDirectoryConstants.DIRECTORIES_UPDATED, this.onDirectoriesReceived);
	},

	getInitialState() {
		return {
			directories: null,
		};
	},

	componentDidMount() {
		this.fetchDirectories();
	},

	onDirectoriesReceived(data) {
		this.setState({
			directories: data,
		});
	},

	fetchDirectories() {
		SocketService.get(FavoriteDirectoryConstants.DIRECTORIES_URL)
			.then(this.onDirectoriesReceived)
			.catch(error => 
				console.error('Failed to load directories: ' + error)
			);
	},

	getRow(directory) {
		return (
			<Row 
				key={ directory.path } 
				directory={ directory }
			/>
		);
	},

	render() {
		if (!this.state.directories) {
			return <Loader text="Loading directories"/>;
		}

		return (
			<div id="directory-table">
				<ActionButton
					action={ FavoriteDirectoryActions.create }
				/>

				{ this.state.directories.length === 0 ? (
						<Message
							title="No directories configured"
							icon={ IconConstants.SETTINGS }
						/>
					) : (
						<table className="ui striped table">
							<thead>
								<tr>
									<th>Name</th>
									<th>Path</th>
								</tr>
							</thead>
							<tbody>
							{ this.state.directories.map(this.getRow) }
							</tbody>
						</table>
					) }
			</div>
		);
	}
});

export default FavoriteDirectoryPage;