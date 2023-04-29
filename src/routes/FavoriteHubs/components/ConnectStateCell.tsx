import { Component } from 'react';
import classNames from 'classnames';

import HubActions from 'actions/reflux/HubActions';
import HubSessionStore from 'stores/HubSessionStore';

import Icon from 'components/semantic/Icon';
import { RowWrapperCellChildProps } from 'components/table/RowWrapperCell';

import * as API from 'types/api';
import { withRouter, RouteComponentProps } from 'react-router-dom';

export type ConnectStateCellProps = RowWrapperCellChildProps<
  API.FavoriteHubConnectState,
  API.FavoriteHubEntry
>;

const getIcon = (state: API.FavoriteHubConnectState) => {
  switch (state.id) {
    case API.FavoriteHubConnectStateEnum.CONNECTING:
      return 'yellow remove';
    case API.FavoriteHubConnectStateEnum.CONNECTED:
      return 'grey remove';
    case API.FavoriteHubConnectStateEnum.DISCONNECTED:
      return 'green video play';
    default:
  }

  return '';
};

class ConnectStateCell extends Component<ConnectStateCellProps & RouteComponentProps> {
  handleCreateSession = () => {
    const { location, history, rowDataGetter } = this.props;
    HubActions.createSession(rowDataGetter!().hub_url, {
      location,
      history,
      sessionStore: HubSessionStore,
    });
  };

  handleRemoveSession = () => {
    const { cellData } = this.props;
    HubActions.removeSession({ id: cellData!.current_hub_id });
  };

  getClickAction = () => {
    switch (this.props.cellData!.id) {
      case API.FavoriteHubConnectStateEnum.CONNECTING:
      case API.FavoriteHubConnectStateEnum.CONNECTED:
        return this.handleRemoveSession;
      case API.FavoriteHubConnectStateEnum.DISCONNECTED:
      default:
        return this.handleCreateSession;
    }
  };

  render() {
    const { cellData, width } = this.props;
    return (
      <div className="connect-state">
        <Icon
          icon={classNames('icon large link', getIcon(cellData!))}
          onClick={this.getClickAction()}
        />
        {width! > 120 && cellData!.str}
      </div>
    );
  }
}

const Decorated = withRouter(ConnectStateCell);

export default Decorated;
