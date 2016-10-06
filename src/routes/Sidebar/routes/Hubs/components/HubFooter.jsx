import React from 'react';

import HubConstants from 'constants/HubConstants';
import SocketService from 'services/SocketService';
import SocketSubscriptionMixin from 'mixins/SocketSubscriptionMixin';
import HubSessionStore from 'stores/HubSessionStore';

import ValueFormat from 'utils/ValueFormat';
import { SessionFooter, FooterItem } from 'routes/Sidebar/components/SessionFooter';
import EncryptionState from 'components/EncryptionState';

import PureRenderMixin from 'react-addons-pure-render-mixin';


const HubFooter = React.createClass({
	mixins: [ SocketSubscriptionMixin(HubSessionStore), PureRenderMixin ],
	propTypes: {
		/**
		 * Currently active session (required)
		 */
		session: React.PropTypes.any,

		userlistToggle: React.PropTypes.node.isRequired,
	},

	onSocketConnected(addSocketListener) {
		const url = HubConstants.SESSION_URL;
		addSocketListener(url, HubConstants.SESSION_COUNTS_UPDATED, this.onCountsReceived, this.props.session.id);
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

	fetchCounts() {
		SocketService.get(HubConstants.SESSION_URL + '/' + this.props.session.id + '/counts')
			.then(this.onCountsReceived)
			.catch(error => console.error('Failed to fetch hub counts', error.message));
	},

	componentDidMount() {
		this.fetchCounts();
	},

	componentDidUpdate(prevProps) {
		if (prevProps.session.id !== this.props.session.id) {
			this.fetchCounts();
		}
	},

	render: function () {
		const { userlistToggle, session } = this.props;
		const { shared, users } = this.state;

		const averageShare = ValueFormat.formatSize(users > 0 ? (shared / users) : 0);

		let userCaption = users + ' users';
		if (session.connect_state.encryption) {
			userCaption = (
				<span>
					<EncryptionState encryption={ session.connect_state.encryption }/>
					{ userCaption }
				</span>
			);
		}


		return (
			<SessionFooter>
				<FooterItem text={ userCaption }/>
				{ window.innerWidth > 700 && (
					<FooterItem text={ ValueFormat.formatSize(shared) + ' (' + averageShare + '/user)' }/> 
				) }
				<div className="userlist-button">
					{ userlistToggle }
				</div>
			</SessionFooter>
		);
	}
});

export default HubFooter;