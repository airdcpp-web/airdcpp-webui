import React from 'react';

import { Link } from 'react-router';
import History from 'utils/History';

import CountLabel from 'components/CountLabel';

const SessionMenuItem = React.createClass({
	propTypes: {
		/**
		 * Item URL
		 */
		url: React.PropTypes.string.isRequired,

		name: React.PropTypes.node.isRequired,

		unreadInfoStore: React.PropTypes.object.isRequired,

		status: React.PropTypes.node.isRequired,
	},

	contextTypes: {
		routerLocation: React.PropTypes.object.isRequired,
	},

	onClick: function (evt) {
		evt.preventDefault();

		History.pushSidebar(this.context.routerLocation, this.props.url);
	},

	render: function () {
		const { item, status, name, unreadInfoStore } = this.props;
		return (
			<Link to={ this.props.url } className="item session-item" onClick={ this.onClick } activeClassName="active">
				<div className="left-content">
					{ status }
					{ name }
				</div>

				{ this.props.unreadInfoStore ? <CountLabel urgencies={ unreadInfoStore.getItemUrgencies(item) }/> : null }
			</Link>
		);
	}
});

export default SessionMenuItem;