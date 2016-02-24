import React from 'react';

import { Link } from 'react-router';
import History from 'utils/History';


const SessionNewButton = React.createClass({
	propTypes: {
		/**
		 * Base URL of the section
		 */
		url: React.PropTypes.string.isRequired,

		/**
		 * Title of the button
		 */
		title: React.PropTypes.node.isRequired,
	},

	contextTypes: {
		routerLocation: React.PropTypes.object.isRequired,
	},

	getDefaultProps() {
		return {
			className: '',
		};
	},

	onClick: function (evt) {
		evt.preventDefault();

		History.pushSidebar(this.context.routerLocation, this.props.url);
	},

	render: function () {
		return (
			<Link to={this.props.url} className={ 'item button-new ' + this.props.className } onClick={this.onClick}>
				<div>
					<i className="plus icon"></i>
					{this.props.title}
				</div>
			</Link>
		);
	}
});

export default SessionNewButton;