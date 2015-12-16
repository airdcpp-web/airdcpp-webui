import React from 'react';
import ReactDOM from 'react-dom';

import ShareProfileActions from 'actions/ShareProfileActions';

import Button from 'components/semantic/Button';
import ValueFormat from 'utils/ValueFormat';

import { ActionMenu } from 'components/menu/DropdownMenu';
import ShareProfileDecorator from 'decorators/ShareProfileDecorator';

const Row = ({ profile, contextGetter }) => (
	<tr>
		<td>
			<ActionMenu 
				caption={ <strong>{profile.name}</strong> } 
				actions={ ShareProfileActions } 
				ids={ profile.default ? [ 'edit', 'remove' ] : [ 'edit', 'default', 'remove' ]} 
				itemData={ profile }
				contextGetter={ contextGetter }
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

	render() {
		return (
			<div className="share-profiles-settings">
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
					{ this.props.profiles
						.map(p => <Row key={p.id} profile={p} contextGetter={ () => ReactDOM.findDOMNode(this) }/>) 
					}
					</tbody>
				</table>
			</div>
		);
	}
});

export default ShareProfileDecorator(ShareProfilesPage, false, false);