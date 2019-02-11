//import PropTypes from 'prop-types';
import React from 'react';

import HubConstants from 'constants/HubConstants';
import SocketService from 'services/SocketService';
import HubSessionStore from 'stores/HubSessionStore';

import { formatSize } from 'utils/ValueFormat';
import { SessionFooter, FooterItem } from 'routes/Sidebar/components/SessionFooter';
import EncryptionState from 'components/EncryptionState';

import * as API from 'types/api';
import * as UI from 'types/ui';

import { ErrorResponse } from 'airdcpp-apisocket';
import { 
  SocketSubscriptionDecorator, SocketSubscriptionDecoratorChildProps
} from 'decorators/SocketSubscriptionDecorator';


interface HubFooterProps {
  session: API.Hub;
  userlistToggle: React.ReactNode;
  sessionT: UI.ModuleTranslator;
}

interface State {
  shared: number;
  users: number;
}


type DataProps = SocketSubscriptionDecoratorChildProps<HubFooterProps>;
class HubFooter extends React.PureComponent<HubFooterProps & DataProps, State> {
  //displayName: 'HubFooter',

  /*static propTypes = {
    // Currently active session (required)
    session: PropTypes.any,

    userlistToggle: PropTypes.node.isRequired,
  };*/

  addSocketListeners = () => {
    const url = HubConstants.SESSIONS_URL;

    const { session, addSocketListener } = this.props;
    addSocketListener(url, HubConstants.SESSION_COUNTS_UPDATED, this.onCountsReceived, session.id);
  }

  state: State = {
    users: 0,
    shared: 0,
  };

  onCountsReceived = (data: API.HubCounts) => {
    this.setState({ 
      users: data.user_count,
      shared: data.share_size,
    });
  }

  fetchCounts = () => {
    SocketService.get(`${HubConstants.SESSIONS_URL}/${this.props.session.id}/counts`)
      .then(this.onCountsReceived)
      .catch((error: ErrorResponse) => console.error('Failed to fetch hub counts', error.message));
  }

  componentDidMount() {
    this.fetchCounts();

    this.addSocketListeners();
  }

  componentDidUpdate(prevProps: HubFooterProps) {
    if (prevProps.session.id !== this.props.session.id) {
      this.fetchCounts();

      this.props.removeSocketListeners(prevProps);
      this.addSocketListeners();
    }
  }

  render() {
    const { userlistToggle, session, sessionT } = this.props;
    const { shared, users } = this.state;

    const averageShare = formatSize(users > 0 ? (shared / users) : 0);

    return (
      <SessionFooter>
        <FooterItem 
          text={(
            <>
              <EncryptionState encryption={ session.encryption }/>
              { sessionT.t('xUsers', {
                  defaultValue: '{{count}} user',
                  defaultValue_plural: '{{count}} users',
                  count: users,
                  replace: {
                    count: users
                  }
                }
              ) }
            </>
          )}
        />
        { window.innerWidth > 700 && (
          <FooterItem 
            text={ sessionT.t('sharePerUser', {
              defaultValue: '{{total}} ({{average}}/user)',
              replace: {
                total: formatSize(shared),
                average: averageShare
              }
            }) }
          /> 
        ) }
        <div className="userlist-button">
          { userlistToggle }
        </div>
      </SessionFooter>
    );
  }
}

export default SocketSubscriptionDecorator(
  HubFooter,
  ({ session }) => !!HubSessionStore.getSession(session.id)
);