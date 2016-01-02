import React from 'react';

import HubConstants from 'constants/HubConstants';
import SocketService from 'services/SocketService';
import SocketSubscriptionMixin from 'mixins/SocketSubscriptionMixin';

import ValueFormat from 'utils/ValueFormat';
import { SessionFooter, FooterItem } from 'routes/Sidebar/components/SessionFooter';


const HubFooter = React.createClass({
	mixins: [ SocketSubscriptionMixin(props => props.item !== this.props.item) ],
	propTypes: {
		/**
		 * Currently active session (required)
		 */
		item: React.PropTypes.any,

		userlistToggle: React.PropTypes.node.isRequired,
	},

	onSocketConnected(addSocketListener) {
		const url = HubConstants.SESSION_URL;
		addSocketListener(url, HubConstants.SESSION_COUNTS_UPDATED, this.onCountsReceived, this.props.item.id);
	},

	getInitialState() {
		return {
			users: 0,
			shared: 0,
		};
	},

	onCountsReceived(data) {
		this.setState({ 
			users: data.user_count,
			shared: data.share_size,
		});
	},

	fetchCounts(item) {
		SocketService.get(HubConstants.SESSION_URL + '/' + item.id + '/counts')
			.then(this.onCountsReceived)
			.catch(error => console.error('Failed to fetch hub counts', error.message));
	},

	componentDidMount() {
		this.fetchCounts(this.props.item);
	},

	componentWillReceiveProps(nextProps) {
		if (nextProps.item !== this.props.item) {
			this.fetchCounts(nextProps.item);
		}
	},

	render: function () {
		const { userlistToggle } = this.props;
		const { shared, users } = this.state;
		return (
			<SessionFooter>
				<FooterItem text={ users + ' users'}/>
				{ window.innerWidth > 700 ? (
					<FooterItem text={ ValueFormat.formatSize(shared) + ' (' + ValueFormat.formatSize(shared / users) + '/user)' }/> 
				): null }
				<div className="userlist-button">
					{ userlistToggle }
				</div>
			</SessionFooter>
		);
	}
});

export default HubFooter;