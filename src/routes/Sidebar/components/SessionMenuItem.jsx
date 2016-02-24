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
	},

	contextTypes: {
		routerLocation: React.PropTypes.object.isRequired,
	},

	onClick: function (evt) {
		evt.preventDefault();

		History.pushSidebar(this.context.routerLocation, this.props.url);
	},

	render: function () {
		const { item } = this.props;
		const status = this.props.statusGetter(item);
		return (
			<Link to={this.props.url} className="item session-item" onClick={this.onClick} activeClassName="active">
				<div className="left-content">
					{ status ? <div className={ 'ui session-status empty circular left mini label ' + status }/> : null }
					{ this.props.nameGetter(item) }
				</div>

				{ this.props.unreadInfoStore ? <CountLabel urgencies={ this.props.unreadInfoStore.getItemUrgencies(item) }/> : null }
			</Link>
		);
	}
});

export default SessionMenuItem;