import React from 'react';

import { FileNameFormatter } from 'utils/IconFormat';
import ValueFormat from 'utils/ValueFormat';


const FileItem = ({ item, itemClickHandler }) => {
	const isFile = item.type.id === 'file';
	return (
		<tr>
			<td>
				<FileNameFormatter 
					typeInfo={ item.type } 
					onClick={ isFile ? null : evt => itemClickHandler(item.name) }
					caption={ item.name }
				/>
			</td>
			<td>
				{ isFile ? ValueFormat.formatSize(item.size) : null }
			</td>
		</tr>
	);
};

const FileItemList = React.createClass({
	propTypes: {
		/**
		 * Function handling the path selection. Receives the selected path as argument.
		 */
		itemClickHandler: React.PropTypes.func.isRequired,

		/**
		 * Array of path objects to list
		 */
		items: React.PropTypes.array.isRequired,
	},

	sort(a, b) {
		if (a.type.id !== b.type.id && (a.type.id === 'directory' || b.type.id === 'directory')) {
			return a.type.id === 'directory' ? -1 : 1;
		}

		return a.name.localeCompare(b.name);
	},

	render: function () {
		return (
			<div className="table-container">
				<table className="ui striped compact table">
					<thead>
						<tr>
							<th>Name</th>
							<th>Size</th>
						</tr>
					</thead>
					<tbody>
						{ this.props.items.sort(this.sort).map(item => 
							<FileItem 
								key={item.name}
								item={item}
								itemClickHandler={ this.props.itemClickHandler }
							/>) }
					</tbody>
				</table>
			</div>
		);
	}
});

export default FileItemList;