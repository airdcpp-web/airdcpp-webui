import React from 'react';
import Popup from './Popup';

import PureRenderMixin from 'react-addons-pure-render-mixin';
import invariant from 'invariant';

// A popup-based class for handling dropdowns in Fixed Data Table
// The normal styled dropdown won"t work there because the table cell won"t allow overflow
// https://github.com/facebook/fixed-data-table/issues/180

const TableDropdown = React.createClass({
	mixins: [ PureRenderMixin ],
	propTypes: {
		/**
		 * Cell content to render
		 */
		caption: React.PropTypes.node.isRequired,

		/**
		 * Trigger the dropdown when clicking on the caption
		 */
		linkCaption: React.PropTypes.bool,
	},

	getDefaultProps() {
		return {
			linkCaption: true
		};
	},

	addCloseHandler(elem) {
		invariant(elem.props.onClick, 'Invalid item for table dropdown (click handler missing)');
		return React.cloneElement(elem, {
			onClick: () => {
				this.refs.dropdownMenu.hide();
				
				elem.props.onClick();
			} 
		});
	},

	render: function () {
		// Caption
		const trigger = (
			<div className="table-dropdown">
				<i className="large angle down icon"></i>
				{ this.props.linkCaption ? this.props.caption : null }
			</div>);

		// Settings
		const settings = {
			position:'bottom left',
			lastResort:true
		};

		return (
			<div>
				<Popup className="basic" trigger={trigger} settings={ settings } ref="dropdownMenu">
					<div className="ui text menu vertical">
					<div className="ui dropdown item">
						{ this.props.children.map(this.addCloseHandler) }
					</div>
					</div>
				</Popup>
				{ this.props.linkCaption ? null : this.props.caption }
			</div>);
	}
});

export default TableDropdown;