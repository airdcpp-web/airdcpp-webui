import * as React from 'react';

import FavoriteHubStore from 'stores/FavoriteHubStore';
import FavoriteHubDialog from './FavoriteHubDialog';

import VirtualTable from 'components/table/VirtualTable';
import { Column } from 'fixed-data-table-2';
import { CheckboxCell, ActionMenuCell } from 'components/table/Cell';
import ConnectStateCell from './ConnectStateCell';

import { ActionMenu, TableActionMenu } from 'components/action-menu';
import { RowWrapperCellChildProps } from 'components/table/RowWrapperCell';

import '../style.css';

import * as API from 'types/api';
import * as UI from 'types/ui';

import { translate, getModuleT } from 'utils/TranslationUtils';
import { useTranslation } from 'react-i18next';
import { updateFavoriteHub } from 'services/api/FavoriteHubApi';
import { runBackgroundSocketAction } from 'utils/ActionUtils';
import MenuConstants from 'constants/MenuConstants';
import {
  FavoriteHubActionMenu,
  FavoriteHubEditActionMenu,
  FavoriteHubPasswordActionMenu,
} from 'actions/ui/favorite-hub';
import { useSession } from 'context/SessionContext';

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
    actions={FavoriteHubPasswordActionMenu}
    itemData={rowDataGetter!}
  />
);

const FavoriteHubs: React.FC = () => {
  const { t } = useTranslation();

  const rowClassNameGetter = (rowData: API.FavoriteHubEntry) => {
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

  const onChangeAutoConnect = (checked: boolean, rowData: API.FavoriteHubEntry) => {
    return runBackgroundSocketAction(
      () =>
        updateFavoriteHub(rowData, {
          auto_connect: checked,
        }),
      t,
    );
  };

  const favT = getModuleT(t, UI.Modules.FAVORITE_HUBS);

  const { hasAccess } = useSession();
  const { translate } = favT;
  const editAccess = hasAccess(API.AccessEnum.HUBS_EDIT);
  return (
    <>
      <VirtualTable
        rowClassNameGetter={rowClassNameGetter}
        footerData={
          <ActionMenu
            className="top left pointing"
            caption={translate('Actions...')}
            actions={FavoriteHubActionMenu}
            header={translate('Favorite hub actions')}
            triggerIcon="chevron up"
            button={true}
            remoteMenuId="favorite_hubs"
            direction="upward"
          />
        }
        store={FavoriteHubStore}
        moduleId={UI.Modules.FAVORITE_HUBS}
      >
        <Column
          name="State"
          width={45}
          columnKey="connect_state"
          cell={editAccess ? <ConnectStateCell /> : undefined}
          flexGrow={3}
        />
        <Column
          name="Name"
          width={150}
          columnKey="name"
          flexGrow={6}
          cell={
            <ActionMenuCell
              actions={FavoriteHubEditActionMenu}
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
            editAccess ? (
              <CheckboxCell onChange={onChangeAutoConnect} type="toggle" />
            ) : undefined
          }
        />
        <Column name="Share profile" width={100} columnKey="share_profile" flexGrow={1} />
        <Column name="Nick" width={100} columnKey="nick" flexGrow={1} />
        <Column
          name="Password"
          width={100}
          columnKey="has_password"
          cell={<PasswordCell />}
        />
      </VirtualTable>
      <FavoriteHubDialog favT={favT} />
    </>
  );
};

export default FavoriteHubs;
