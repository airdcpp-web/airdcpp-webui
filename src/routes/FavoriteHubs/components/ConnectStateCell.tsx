import classNames from 'classnames';

import Icon from '@/components/semantic/Icon';
import { RowWrapperCellChildProps } from '@/components/table/RowWrapperCell';

import * as API from '@/types/api';

import { useNavigate } from 'react-router';
import { HubAPIActions } from '@/actions/store/HubActions';
import { useSessionStore } from '@/context/SessionStoreContext';
import { useSocket } from '@/context/SocketContext';
import { useTranslation } from 'react-i18next';

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
  const navigate = useNavigate();
  const sessionStore = useSessionStore();
  const socket = useSocket();
  const { t } = useTranslation();

  const handleCreateSession = () => {
    const data = {
      hubUrl: rowDataGetter!().hub_url,
    };

    HubAPIActions.createSession(data, {
      navigate,
      sessionStore,
      socket,
      t,
    });
  };

  const handleRemoveSession = () => {
    HubAPIActions.removeSession({ id: cellData!.current_hub_id });
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
