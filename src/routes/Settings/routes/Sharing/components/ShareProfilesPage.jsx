import React from 'react';
import ReactDOM from 'react-dom';

import ShareProfileActions from 'actions/ShareProfileActions';

import Button from 'components/semantic/Button';
import ValueFormat from 'utils/ValueFormat';

import FilelistActions from 'actions/FilelistActions';
import ActionButton from 'components/ActionButton';

import { ActionMenu } from 'components/menu/DropdownMenu';
import ShareProfileDecorator from 'decorators/ShareProfileDecorator';

import '../style.css';


const Row = ({ profile, contextGetter, location }) => (
	<tr>
		<td>
			<ActionMenu 
				caption={ <strong>{profile.name}</strong> } 
				actions={ ShareProfileActions } 
				ids={ profile.default ? [ 'edit', 'remove' ] : [ 'edit', 'default', 'remove' ]} 
				itemData={ profile }
				contextGetter={ contextGetter }
			/>
			<ActionButton 
				action={ FilelistActions.ownList }
				args={ [ location, profile.id ] }
				className="basic browse"
			/>
		</td>
		<td>
			{ ValueFormat.formatSize(profile.size) }
		</td>
		<td>
			{ profile.files }
		</td>
	</tr>
);

const ShareProfilesPage = React.createClass({
	_handleAddProfile() {
		ShareProfileActions.create();
	},

	getRow(profile) {
		return (
			<Row 
				key={ profile.id } 
				profile={ profile } 
				contextGetter={ () => ReactDOM.findDOMNode(this) }
				location={ this.props.location }
			/>
		);
	},

	render() {
		return (
			<div>
				<Button
					icon="plus icon"
					onClick={this._handleAddProfile}
					caption="Add profile"
				/>

				<table className="ui striped table">
					<thead>
						<tr>
							<th>Name</th>
							<th>Total size</th>
							<th>Total files</th>
						</tr>
					</thead>
					<tbody>
					{ this.props.profiles.map(this.getRow) }
					</tbody>
				</table>
			</div>
		);
	}
});

export default ShareProfileDecorator(ShareProfilesPage, false, false);