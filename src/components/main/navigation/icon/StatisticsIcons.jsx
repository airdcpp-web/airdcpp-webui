import React from 'react';

import createReactClass from 'create-react-class';

import SocketService from 'services/SocketService';
import { formatSize, formatSpeed } from 'utils/ValueFormat';
import SocketSubscriptionMixin from 'mixins/SocketSubscriptionMixin';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import Icon from 'components/semantic/Icon';

import AccessConstants from 'constants/AccessConstants';
import LoginStore from 'stores/LoginStore';

import HashConstants from 'constants/HashConstants';
import IconConstants from 'constants/IconConstants';
import TransferConstants from 'constants/TransferConstants';


const StatisticsIcon = ({ icon, cornerIcon, bytes, formatter }) => {
  if (bytes === 0) {
    return null;
  }

  return (
    <div className="item">
      { !!cornerIcon ? (
        <i className="icon">
          <Icon icon={ icon } cornerIcon={ cornerIcon }/>
        </i>
      ) : (
        <Icon icon={ icon }/>
      ) }
      <div className="content" style={ !!cornerIcon ? { paddingLeft: '.2em' } : undefined }>
        <div className="header">{ formatter(bytes) }</div>
      </div>
    </div>
  );
};

const StatisticsIcons = createReactClass({
  displayName: 'StatisticsIcons',
  mixins: [ PureRenderMixin, SocketSubscriptionMixin() ],

  getDefaultProps() {
    return {
      className: '',
    };
  },

  onSocketConnected(addSocketListener) {
    addSocketListener(TransferConstants.MODULE_URL, TransferConstants.STATISTICS, this.onStatsReceived, null, AccessConstants.TRANSFERS);
    addSocketListener(HashConstants.MODULE_URL, HashConstants.STATISTICS, this.onStatsReceived, null, AccessConstants.SETTINGS_VIEW);
  },

  fetchStats() {
    if (LoginStore.hasAccess(AccessConstants.TRANSFERS)) {
      SocketService.get(TransferConstants.STATISTICS_URL)
        .then(this.onStatsReceived)
        .catch(error => console.error('Failed to fetch transfer statistics', error.message));
    }
  },

  componentDidMount() {
    this.fetchStats();
  },

  onStatsReceived(data) {
    const newState = Object.assign({}, this.state, data);
    this.setState(newState);
  },

  getInitialState() {
    return {
      speed_down: 0,
      speed_up: 0,
      hash_speed: 0,
      hash_bytes_left: 0,
      queued_bytes: 0,
    };
  },

  render: function () {
    return (
      <div className={ 'ui centered inverted mini list statistics-icons ' + this.props.className }>
        <StatisticsIcon 
          icon={ IconConstants.DOWNLOAD }
          bytes={ this.state.speed_down }
          formatter={ formatSpeed }
        />
        <StatisticsIcon 
          icon={ IconConstants.UPLOAD }
          bytes={ this.state.speed_up }
          formatter={ formatSpeed }
        />
        <StatisticsIcon 
          icon={ IconConstants.HASH }
          bytes={ this.state.hash_speed }
          formatter={ formatSpeed }
        />
        <StatisticsIcon 
          icon={ IconConstants.HASH }
          cornerIcon="wait"
          bytes={ this.state.hash_bytes_left }
          formatter={ formatSize }
        />
        <StatisticsIcon 
          icon={ IconConstants.QUEUE }
          bytes={ this.state.queued_bytes }
          formatter={ formatSize }
        />
      </div>
    );
  },
});

export default StatisticsIcons;
