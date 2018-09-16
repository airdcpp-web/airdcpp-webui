import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';

import HubActions from 'actions/HubActions';
import HubSessionStore from 'stores/HubSessionStore';

import Icon from 'components/semantic/Icon';
import { RowWrapperCellChildProps } from 'components/table/RowWrapperCell';

import * as API from 'types/api';


export interface ConnectStateCellProps extends 
  RowWrapperCellChildProps<API.FavoriteHubConnectState, API.FavoriteHubEntry> {

}

class ConnectStateCell extends React.Component<ConnectStateCellProps> {
  static contextTypes = {
    router: PropTypes.object.isRequired,
  };

  getIcon = () => {
    switch (this.props.cellData!.id) {
      case API.FavoriteHubConnectStateId.CONNECTING:
        return 'yellow remove';
      case API.FavoriteHubConnectStateId.CONNECTED:
        return 'grey remove';
      case API.FavoriteHubConnectStateId.DISCONNECTED:
        return 'green video play';
      default:
    }

    return '';
  }

  handleCreateSession = () => {
    HubActions.createSession(this.context.router.route.location, this.props.rowDataGetter!().hub_url, HubSessionStore);
  }

  handleRemoveSession = () => {
    HubActions.removeSession({ id: this.props.cellData!.current_hub_id });
  }

  getClickAction = () => {
    switch (this.props.cellData!.id) {
      case API.FavoriteHubConnectStateId.CONNECTING:
      case API.FavoriteHubConnectStateId.CONNECTED: return this.handleRemoveSession;
      case API.FavoriteHubConnectStateId.DISCONNECTED:
      default: return this.handleCreateSession;
    }
  }

  render() {
    return (
      <div className="connect-state">
        <Icon 
          icon={ classNames('icon large link', this.getIcon()) } 
          onClick={ this.getClickAction() }
        />
        { this.props.width! > 120 && this.props.cellData!.str }
      </div>
    );
  }
}

export default ConnectStateCell;