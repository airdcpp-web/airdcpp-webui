import React from 'react';

import ShareProfileActions from 'actions/ShareProfileActions';

import ActionButton from 'components/ActionButton';
import ValueFormat from 'utils/ValueFormat';

import { ActionMenu } from 'components/menu/DropdownMenu';
import ShareProfileDecorator from 'decorators/ShareProfileDecorator';
import { LocationContext } from 'mixins/RouterMixin';

import '../style.css';


const Row = ({ profile }) => (
	<tr>
		<td>
			<ActionMenu 
				caption={ <strong>{profile.name}</strong> } 
				actions={ ShareProfileActions } 
				ids={ profile.default ? [ 'browse', 'divider', 'edit', 'remove' ] : [ 'browse', 'divider', 'edit', 'default', 'remove' ]} 
				itemData={ profile }
				contextGetter={ _ => '#setting-scroll-context' }
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
	mixins: [ LocationContext ],
	getRow(profile) {
		return (
			<Row 
				key={ profile.id } 
				profile={ profile } 
			/>
		);
	},

	render() {
		return (
			<div>
				<ActionButton
					action={ ShareProfileActions.create }
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