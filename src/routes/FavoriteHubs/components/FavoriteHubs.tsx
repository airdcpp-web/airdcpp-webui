import React from 'react';

import FavoriteHubActions from 'actions/FavoriteHubActions';
import FavoriteHubPasswordActions from 'actions/FavoriteHubPasswordActions';
import FavoriteHubStore from 'stores/FavoriteHubStore';
import FavoriteHubDialog from './FavoriteHubDialog';

import VirtualTable from 'components/table/VirtualTable';
import { Column } from 'fixed-data-table-2';
import { CheckboxCell, ActionMenuCell } from 'components/table/Cell';
import ConnectStateCell from './ConnectStateCell';

import { TableActionMenu } from 'components/menu';
import ActionButton from 'components/ActionButton';
import { RowWrapperCellChildProps } from 'components/table/RowWrapperCell';

import LoginStore from 'stores/LoginStore';

import '../style.css';

import * as API from 'types/api';


const PasswordCell: React.FC<RowWrapperCellChildProps<string, API.FavoriteHubEntry>> = (
  { cellData, rowDataGetter }
) => (
  <TableActionMenu 
    caption={ cellData ? <strong>Set</strong> : 'Not set' } 
    actions={ FavoriteHubPasswordActions } 
    itemData={ rowDataGetter! }
  />
);

class FavoriteHubs extends React.Component {
  static displayName = 'FavoriteHubs';

  rowClassNameGetter = (rowData: API.FavoriteHubEntry) => {
    switch (rowData.connect_state.id) {
      case API.FavoriteHubConnectStateEnum.CONNECTING:
        return 'connecting';
      case API.FavoriteHubConnectStateEnum.CONNECTED:
        return 'connected';
      case API.FavoriteHubConnectStateEnum.DISCONNECTED:
        return 'disconnected';
      default:
    }

    return '';
  }

  onChangeAutoConnect = (checked: boolean, rowData: API.FavoriteHubEntry) => {
    FavoriteHubActions.actions.update(rowData, { auto_connect: checked });
  }

  render() {
    const footerData = (
      <ActionButton 
        action={ FavoriteHubActions.actions.create }
        moduleId={ FavoriteHubActions.id }
      />
    );

    const editAccess = LoginStore.hasAccess(API.AccessEnum.HUBS_EDIT);
    return (
      <>
        <VirtualTable
          rowClassNameGetter={ this.rowClassNameGetter }
          footerData={ footerData }
          store={ FavoriteHubStore }
          moduleId={ FavoriteHubActions.id }
        >
          <Column
            name="State"
            width={ 45 }
            columnKey="connect_state"
            cell={ editAccess && <ConnectStateCell/> }
            flexGrow={ 3 }
          />
          <Column
            name="Name"
            width={ 150 }
            columnKey="name"
            flexGrow={ 6 }
            cell={ 
              <ActionMenuCell 
                actions={ FavoriteHubActions }
              /> 
            }
          />
          <Column
            name="Address"
            width={ 270 }
            columnKey="hub_url"
            flexGrow={ 3 }
            hideWidth={ 700 }
          />
          <Column
            name="Auto connect"
            width={ 65 }
            columnKey="auto_connect"
            cell={ editAccess && (
              <CheckboxCell 
                onChange={ this.onChangeAutoConnect } 
                type="toggle"
              />
            ) }
          />
          <Column
            name="Share profile"
            width={ 100 }
            columnKey="share_profile"
            flexGrow={ 1 }
          />
          <Column
            name="Nick"
            width={ 100 }
            columnKey="nick"
            flexGrow={ 1 }
          />
          <Column
            name="Password"
            width={ 100 }
            columnKey="has_password"
            cell={ <PasswordCell/> }
          />
        </VirtualTable>
        <FavoriteHubDialog/>
      </>
    );
  }
}

export default FavoriteHubs;
