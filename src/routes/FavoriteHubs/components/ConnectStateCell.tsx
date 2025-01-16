import classNames from 'classnames';

import HubActions from 'actions/reflux/HubActions';
import HubSessionStore from 'stores/reflux/HubSessionStore';

import Icon from 'components/semantic/Icon';
import { RowWrapperCellChildProps } from 'components/table/RowWrapperCell';

import * as API from 'types/api';
import { useLocation, useNavigate } from 'react-router';

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

const ConnectStateCell: React.FC<ConnectStateCellProps> = ({
  width,
  cellData,
  rowDataGetter,
}) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleCreateSession = () => {
    HubActions.createSession(rowDataGetter!().hub_url, {
      location,
      navigate,
      sessionStore: HubSessionStore,
    });
  };

  const handleRemoveSession = () => {
    HubActions.removeSession({ id: cellData!.current_hub_id });
  };

  const getClickAction = () => {
    switch (cellData!.id) {
      case API.FavoriteHubConnectStateEnum.CONNECTING:
      case API.FavoriteHubConnectStateEnum.CONNECTED:
        return handleRemoveSession;
      case API.FavoriteHubConnectStateEnum.DISCONNECTED:
      default:
        return handleCreateSession;
    }
  };

  return (
    <div className="connect-state">
      <Icon
        icon={classNames('icon large link', getIcon(cellData!))}
        onClick={getClickAction()}
      />
      {width! > 120 && cellData!.str}
    </div>
  );
};

export default ConnectStateCell;
