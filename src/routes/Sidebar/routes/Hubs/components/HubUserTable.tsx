import * as React from 'react';
import { Column } from 'fixed-data-table-2';

import HubUserViewStore from '@/stores/views/HubUserViewStore';

import VirtualTable from '@/components/table/VirtualTable';
import { SizeCell, ConnectionCell, IpCell } from '@/components/table/Cell';

import { TableUserMenu } from '@/components/action-menu';

import Message from '@/components/semantic/Message';
import Loader from '@/components/semantic/Loader';
import { RowWrapperCellChildProps } from '@/components/table/RowWrapperCell';

import * as API from '@/types/api';
import * as UI from '@/types/ui';

import IconConstants from '@/constants/IconConstants';
import MenuConstants from '@/constants/MenuConstants';
import { useSessionStoreProperty } from '@/context/SessionStoreContext';
import { HubStoreSelector } from '@/stores/session/hubSessionSlice';

interface NickCellProps extends RowWrapperCellChildProps<string, API.HubUser> {
  hub: API.Hub;
}

const NickCell: React.FC<NickCellProps> = ({ cellData, rowDataGetter, hub }) => (
  <TableUserMenu
    text={cellData}
    user={rowDataGetter!()}
    userIcon={true}
    remoteMenuId={MenuConstants.HUB_USER}
    entity={hub}
  />
);

interface HubUserTableProps {
  hub: API.Hub;
  sessionT: UI.ModuleTranslator;
}

const HubUserTable: React.FC<HubUserTableProps> = ({ hub, sessionT }) => {
  const rowClassNameGetter = (user: API.HubUser) => {
    return user.flags.join(' ');
  };

  const emptyRowsNodeGetter = () => {
    const connectState = hub.connect_state.id;

    if (
      connectState === API.HubConnectStateEnum.DISCONNECTED ||
      connectState === API.HubConnectStateEnum.REDIRECT
    ) {
      return (
        <div className="offline-message">
          <Message
            className="offline"
            title={sessionT.translate('Not connected to the hub')}
            icon={IconConstants.OFFLINE}
          />
        </div>
      );
    }

    const text = sessionT.translate(
      connectState !== API.HubConnectStateEnum.CONNECTED
        ? 'Connecting'
        : 'Loading userlist',
    );

    return (
      <div className="loader-wrapper">
        <Loader text={text} />
      </div>
    );
  };

  const hubStore = useSessionStoreProperty(HubStoreSelector);
  return (
    <VirtualTable
      store={HubUserViewStore}
      entityId={hub.id}
      sessionStore={hubStore}
      rowClassNameGetter={rowClassNameGetter}
      emptyRowsNodeGetter={emptyRowsNodeGetter}
      moduleId={UI.Modules.HUBS}
      textFilterProps={{
        autoFocus: true,
      }}
    >
      <Column
        name="Nick"
        width={170}
        columnKey="nick"
        flexGrow={8}
        cell={<NickCell hub={hub} />}
      />
      <Column
        name="Share size"
        width={85}
        columnKey="share_size"
        cell={<SizeCell />}
        flexGrow={1}
      />
      <Column name="Description" width={100} columnKey="description" flexGrow={1} />
      <Column name="Tag" width={150} columnKey="tag" flexGrow={2} />
      <Column
        name="Upload speed"
        width={80}
        columnKey="upload_speed"
        cell={<ConnectionCell />}
        flexGrow={2}
      />
      <Column
        name="Download speed"
        width={80}
        columnKey="download_speed"
        cell={<ConnectionCell />}
        flexGrow={2}
      />
      <Column name="IP (v4)" width={120} columnKey="ip4" flexGrow={3} cell={<IpCell />} />
      <Column name="IP (v6)" width={120} columnKey="ip6" flexGrow={3} cell={<IpCell />} />
      <Column name="Files" width={70} columnKey="file_count" flexGrow={3} />
    </VirtualTable>
  );
};

export default HubUserTable;
