'use strict';

import React from 'react';

import { Link } from 'react-router';

const MenuItemLink = React.createClass({
	propTypes: {
		/**
		 * Item URL
		 */
		url: React.PropTypes.string.isRequired,

		/**
		 * Title of the button
		 */
		title: React.PropTypes.any.isRequired,
	},

	render: function () {
		return (
			<Link to={this.props.url} className={ 'item ' + (this.props.className ? this.props.className : '') } activeClassName="active">
				{ this.props.title }
			</Link>
		);
	}
});

export default MenuItemLink;