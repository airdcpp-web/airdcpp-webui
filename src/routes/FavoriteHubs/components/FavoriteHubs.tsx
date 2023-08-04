import * as React from 'react';

import FavoriteHubActions from 'actions/ui/FavoriteHubActions';
import FavoriteHubPasswordActions from 'actions/ui/FavoriteHubPasswordActions';
import FavoriteHubStore from 'stores/FavoriteHubStore';
import FavoriteHubDialog from './FavoriteHubDialog';

import VirtualTable from 'components/table/VirtualTable';
import { Column } from 'fixed-data-table-2';
import { CheckboxCell, ActionMenuCell } from 'components/table/Cell';
import ConnectStateCell from './ConnectStateCell';

import { TableActionMenu } from 'components/action-menu';
import ActionButton from 'components/ActionButton';
import { RowWrapperCellChildProps } from 'components/table/RowWrapperCell';

import LoginStore from 'stores/LoginStore';

import '../style.css';

import * as API from 'types/api';
import * as UI from 'types/ui';

import { translate, getModuleT } from 'utils/TranslationUtils';
import { withTranslation, WithTranslation } from 'react-i18next';
import { updateFavoriteHub } from 'services/api/FavoriteHubApi';
import { runBackgroundSocketAction } from 'utils/ActionUtils';
import MenuConstants from 'constants/MenuConstants';

const PasswordCell: React.FC<RowWrapperCellChildProps<string, API.FavoriteHubEntry>> = ({
  cellData,
  rowDataGetter,
  t,
}) => (
  <TableActionMenu
    caption={
      cellData ? (
        <strong>{translate('Set', t!, UI.Modules.FAVORITE_HUBS)}</strong>
      ) : (
        translate('Not set', t!, UI.Modules.FAVORITE_HUBS)
      )
    }
    actions={FavoriteHubPasswordActions}
    itemData={rowDataGetter!}
  />
);

class FavoriteHubs extends React.Component<WithTranslation> {
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
  };

  onChangeAutoConnect = (checked: boolean, rowData: API.FavoriteHubEntry) => {
    return runBackgroundSocketAction(
      () =>
        updateFavoriteHub(rowData, {
          auto_connect: checked,
        }),
      this.props.t,
    );
  };

  favT = getModuleT(this.props.t, UI.Modules.FAVORITE_HUBS);
  render() {
    const footerData = (
      <ActionButton actions={FavoriteHubActions.create} actionId="create" />
    );

    const editAccess = LoginStore.hasAccess(API.AccessEnum.HUBS_EDIT);
    return (
      <>
        <VirtualTable
          rowClassNameGetter={this.rowClassNameGetter}
          footerData={footerData}
          store={FavoriteHubStore}
          moduleId={UI.Modules.FAVORITE_HUBS}
        >
          <Column
            name="State"
            width={45}
            columnKey="connect_state"
            cell={editAccess && <ConnectStateCell />}
            flexGrow={3}
          />
          <Column
            name="Name"
            width={150}
            columnKey="name"
            flexGrow={6}
            cell={
              <ActionMenuCell
                actions={FavoriteHubActions.edit}
                remoteMenuId={MenuConstants.FAVORITE_HUB}
              />
            }
          />
          <Column
            name="Address"
            width={270}
            columnKey="hub_url"
            flexGrow={3}
            hideWidth={700}
          />
          <Column
            name="Auto connect"
            width={65}
            columnKey="auto_connect"
            cell={
              editAccess && (
                <CheckboxCell onChange={this.onChangeAutoConnect} type="toggle" />
              )
            }
          />
          <Column
            name="Share profile"
            width={100}
            columnKey="share_profile"
            flexGrow={1}
          />
          <Column name="Nick" width={100} columnKey="nick" flexGrow={1} />
          <Column
            name="Password"
            width={100}
            columnKey="has_password"
            cell={<PasswordCell />}
          />
        </VirtualTable>
        <FavoriteHubDialog favT={this.favT} />
      </>
    );
  }
}

export default withTranslation()(FavoriteHubs);
