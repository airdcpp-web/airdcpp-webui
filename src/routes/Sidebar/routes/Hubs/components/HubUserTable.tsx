import PropTypes from 'prop-types';
import React from 'react';

import HubSessionStore from 'stores/HubSessionStore';
import HubUserViewStore from 'stores/HubUserViewStore';

import { Column } from 'fixed-data-table-2';
import VirtualTable from 'components/table/VirtualTable';
import { SizeCell, ConnectionCell, IpCell } from 'components/table/Cell';

import { TableUserMenu } from 'components/menu';

import Message from 'components/semantic/Message';
import Loader from 'components/semantic/Loader';
import { RowWrapperCellChildProps } from 'components/table/RowWrapperCell';

import * as API from 'types/api';
import * as UI from 'types/ui';
import IconConstants from 'constants/IconConstants';
import MenuConstants from 'constants/MenuConstants';


interface NickCellProps extends RowWrapperCellChildProps<string, API.HubUser> {
  session: API.Hub;
}

const NickCell: React.FC<NickCellProps> = (
  { cellData, rowDataGetter, session }
) => (
  <TableUserMenu 
    text={ cellData } 
    user={ rowDataGetter!() }
    userIcon={ true }
    remoteMenuId={ MenuConstants.HUB_USER }
    entityId={ session.id }
  />
);


interface HubUserTableProps {
  session: API.Hub;
  sessionT: UI.ModuleTranslator;
}

class HubUserTable extends React.Component<HubUserTableProps> {
  static propTypes = {
    session: PropTypes.object, // required
  };

  rowClassNameGetter = (user: API.HubUser) => {
    return user.flags.join(' ');
  }

  emptyRowsNodeGetter = () => {
    const { session, sessionT } = this.props;
    const connectState = session.connect_state.id;

    if (connectState === API.HubConnectStateEnum.DISCONNECTED) {
      return (
        <div className="offline-message">
          <Message 
            className="offline"
            title={ sessionT.translate('Not connected to the hub') }
            icon={ IconConstants.OFFLINE }
          />
        </div>
      );
    } 

    const text = sessionT.translate(
      connectState !== API.HubConnectStateEnum.CONNECTED ? 'Connecting' : 'Loading userlist'
    );
    
    return (
      <div className="loader-wrapper">
        <Loader text={ text }/>
      </div>
    );
  }

  render() {
    const { session } = this.props;
    return (
      <VirtualTable
        store={ HubUserViewStore }
        entityId={ session.id }
        sessionStore={ HubSessionStore }
        rowClassNameGetter={ this.rowClassNameGetter }
        emptyRowsNodeGetter={ this.emptyRowsNodeGetter }
        moduleId={ UI.Modules.HUBS }
      >
        <Column
          name="Nick"
          width={170}
          columnKey="nick"
          flexGrow={8}
          cell={ <NickCell session={ session }/> }
        />
        <Column
          name="Share size"
          width={85}
          columnKey="share_size"
          cell={ <SizeCell/> }
          flexGrow={1}
        />
        <Column
          name="Description"
          width={100}
          columnKey="description"
          flexGrow={1}
        />
        <Column
          name="Tag"
          width={150}
          columnKey="tag"
          flexGrow={2}
        />
        <Column
          name="Upload speed"
          width={80}
          columnKey="upload_speed"
          cell={ <ConnectionCell/> }
          flexGrow={2}
        />
        <Column
          name="Download speed"
          width={80}
          columnKey="download_speed"
          cell={ <ConnectionCell/> }
          flexGrow={2}
        />
        <Column
          name="IP (v4)"
          width={120}
          columnKey="ip4"
          flexGrow={3}
          cell={ <IpCell/> }
        />
        <Column
          name="IP (v6)"
          width={120}
          columnKey="ip6"
          flexGrow={3}
          cell={ <IpCell/> }
        />
        <Column
          name="Files"
          width={70}
          columnKey="file_count"
          flexGrow={3}
        />
      </VirtualTable>
    );
  }
}

export default HubUserTable;