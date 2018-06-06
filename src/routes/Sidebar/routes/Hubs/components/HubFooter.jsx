import PropTypes from 'prop-types';
import React from 'react';

import createReactClass from 'create-react-class';

import HubConstants from 'constants/HubConstants';
import SocketService from 'services/SocketService';
import SocketSubscriptionMixin from 'mixins/SocketSubscriptionMixin';
import HubSessionStore from 'stores/HubSessionStore';

import { formatSize } from 'utils/ValueFormat';
import { SessionFooter, FooterItem } from 'routes/Sidebar/components/SessionFooter';
import EncryptionState from 'components/EncryptionState';

import PureRenderMixin from 'react-addons-pure-render-mixin';


const HubFooter = createReactClass({
  displayName: 'HubFooter',
  mixins: [ SocketSubscriptionMixin(HubSessionStore), PureRenderMixin ],

  propTypes: {
    /**
		 * Currently active session (required)
		 */
    session: PropTypes.any,

    userlistToggle: PropTypes.node.isRequired,
  },

  onSocketConnected(addSocketListener) {
    const url = HubConstants.SESSIONS_URL;
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
    SocketService.get(HubConstants.SESSIONS_URL + '/' + this.props.session.id + '/counts')
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

    const averageShare = formatSize(users > 0 ? (shared / users) : 0);

    let userCaption = users + ' users';
    if (session.encryption) {
      userCaption = (
        <span>
          <EncryptionState encryption={ session.encryption }/>
          { userCaption }
        </span>
      );
    }


    return (
      <SessionFooter>
        <FooterItem text={ userCaption }/>
        { window.innerWidth > 700 && (
          <FooterItem text={ formatSize(shared) + ' (' + averageShare + '/user)' }/> 
        ) }
        <div className="userlist-button">
          { userlistToggle }
        </div>
      </SessionFooter>
    );
  },
});

export default HubFooter;