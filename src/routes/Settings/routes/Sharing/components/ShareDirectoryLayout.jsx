import React from 'react';
import ReactDOM from 'react-dom';

import ShareRootActions from 'actions/ShareRootActions';
import { SHARE_ROOT_CREATED, SHARE_ROOT_UPDATED, SHARE_ROOT_REMOVED, SHARE_ROOTS_URL, SHARE_MODULE_URL } from 'constants/ShareConstants';

import Message from 'components/semantic/Message';
import SocketService from 'services/SocketService';
import ValueFormat from 'utils/ValueFormat';

import { ActionMenu } from 'components/Menu';
import SocketSubscriptionMixin from 'mixins/SocketSubscriptionMixin';
import Accordion from 'components/semantic/Accordion';

import '../style.css';

const Row = ({ root, contextGetter, location }) => (
	<tr>
		<td>
			<ActionMenu 
				caption={ root.path } 
				actions={ ShareRootActions } 
				ids={ [ 'edit', 'remove' ] } 
				itemData={ root }
				contextGetter={ contextGetter }
				location={ location }
			/>
		</td>
		<td>
			{ ValueFormat.formatSize(root.size) }
		</td>
		<td>
			{ root.profiles.length }
		</td>
	</tr>
);

/*const Table = ({ name, roots, contextGetter }) => (
	<div className="root-table">
		<h4 className="ui horizontal divider header">
			<i className="tag icon"></i>
			{name}
		</h4>
		<table className="ui striped table">
			<tbody>
			{ roots
				//.filter(p => p.id !== HIDDEN_PROFILE_ID)
				.map(root => <Row key={root.path} root={root} contextGetter={ contextGetter }/>) 
			}
			</tbody>
		</table>
	</div>
);*/

const GroupedSection = React.createClass({
	formatTitle() {
		const size = this.props.roots.reduce((sum, root) => sum + root.size, 0);

		const name = this.props.name + ' (' + ValueFormat.formatSize(size) + ')';
		if (this.props.roots.length === 1) {
			return name;
		}

		return name + ' (' + this.props.roots.length + ' directories )';
	},

	render() {
		return (
			<div>
				<div className="title">
					<i className="dropdown icon"></i>
					{ this.formatTitle() }
				</div>

				<div className="content">
				<table className="ui striped table">
					<thead>
						<tr>
							<th>Path</th>
							<th>Size</th>
							<th>Profiles</th>
						</tr>
					</thead>
					<tbody>
					{ this.props.roots
						.map(root => <Row key={root.path} root={root} contextGetter={ this.props.contextGetter } location={ this.props.location }/>) 
					}
					</tbody>
				</table>
				</div>
			</div>
		);
	}
});

const ShareDirectoryLayout = React.createClass({
	mixins: [ SocketSubscriptionMixin() ],
	componentDidMount() {
		this.fetchRoots();
	},

	fetchRoots() {
		SocketService.get(SHARE_ROOTS_URL)
			.then(this.onRootsReceived)
			.catch(error => 
				console.error('Failed to load roots: ' + error)
			);
	},

	onSocketConnected(addSocketListener) {
		addSocketListener(SHARE_MODULE_URL, SHARE_ROOT_CREATED, this.fetchRoots);
		addSocketListener(SHARE_MODULE_URL, SHARE_ROOT_UPDATED, this.fetchRoots);
		addSocketListener(SHARE_MODULE_URL, SHARE_ROOT_REMOVED, this.fetchRoots);
	},

	getInitialState() {
		return {
			groupedRoots: null,
		};
	},

	_handleAddDirectory() {
		ShareRootActions.create();
	},

	onRootsReceived(data) {
		const groupedRoots = data.reduce((grouped, root) => {
			const list = grouped[root.virtual_name] || [];
			list.push(root);
			grouped[root.virtual_name] = list;
			return grouped;
		}, {});

		this.setState({ groupedRoots: groupedRoots });
	},

	filterRoot(root) {
		return !this.props.selectedProfileId || root.profiles.indexOf(this.props.selectedProfileId) > -1;
	},

	getTable(tables, name) {
		const roots = this.state.groupedRoots[name].filter(this.filterRoot);
		if (roots.length === 0) {
			return tables;
		}

		tables.push(
			<GroupedSection 
				key={name} 
				name={name} 
				roots={roots} 
				contextGetter={ () => ReactDOM.findDOMNode(this) }
				location={ this.props.location }
			/>
		);

		return tables;
	},

	render() {
		if (!this.state.groupedRoots) {
			return null;
		}

		const sections = Object.keys(this.state.groupedRoots)
					.sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()))
					.reduce(this.getTable, []);

		if (sections.length === 0) {
			return (
				<Message 
					title={ 'No directories to display' }
					description={ Object.keys(this.state.groupedRoots).length === 0 ? 'No shared directories' : 'The selected profile is empty' }
				/>
			);
		}

		return (
			<Accordion className="styled directory-section">
				{ sections }
			</Accordion>
		);
	}
});

export default ShareDirectoryLayout;