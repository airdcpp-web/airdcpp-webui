import React from 'react';

import { FileNameFormatter } from 'utils/IconFormat';


const PathItem = ({ item, itemClickHandler, itemIcon, iconClickHandler }) => (
	<tr>
		<td>
			<FileNameFormatter item={ item.type }>
				<a onClick={evt => itemClickHandler(item.name)}>
					{ item.name }
				</a>
				{ itemIcon ? <i className={ itemIcon + ' link icon' } onClick={ () => iconClickHandler(item.name) }></i> : null }
			</FileNameFormatter>
		</td>
		{/*<td>
			{ Formatter.formatSize(item.size) }
		</td>*/}
	</tr>
);

const PathList = React.createClass({
	propTypes: {
		/**
		 * Function handling the path selection. Receives the selected path as argument.
		 */
		itemClickHandler: React.PropTypes.func.isRequired,

		/**
		 * Function handling the path selection. Receives the selected path as argument.
		 */
		iconClickHandler: React.PropTypes.func,

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
							{/*<th>Size</th>*/}
						</tr>
					</thead>
					<tbody>
						{ this.props.items.sort(this.sort).map(item => 
							<PathItem 
								key={item.name}
								item={item}
								itemIcon={this.props.itemIcon} 
								iconClickHandler={ this.props.iconClickHandler } 
								itemClickHandler={ this.props.itemClickHandler }
							/>) }
					</tbody>
				</table>
			</div>
		);
	}
});

export default PathList;