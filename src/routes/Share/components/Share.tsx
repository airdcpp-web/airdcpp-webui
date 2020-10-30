import { Component } from 'react';

import ShareActions from 'actions/ui/ShareActions';
import ShareRootActions from 'actions/ui/ShareRootActions';
import ShareRootStore from 'stores/ShareRootStore';

import VirtualTable from 'components/table/VirtualTable';
import { SizeCell, DurationCell, FileActionCell } from 'components/table/Cell';
import { Column } from 'fixed-data-table-2';

import ShareDirectoryDialog from 'routes/Share/components/ShareDirectoryDialog';
import ShareProfileFilter from 'components/table/ShareProfileFilter';

import { ActionMenu } from 'components/menu';
import RefreshCell from 'routes/Share/components/RefreshCell';

import LoginStore from 'stores/LoginStore';

import * as API from 'types/api';
import * as UI from 'types/ui';

import { withTranslation, WithTranslation } from 'react-i18next';
import { getModuleT } from 'utils/TranslationUtils';
import MenuConstants from 'constants/MenuConstants';


class Share extends Component<WithTranslation> {
  static displayName = 'Share';

  shareT = getModuleT(this.props.t, UI.Modules.SHARE);
  render() {
    const { translate } = this.shareT;
    const editAccess = LoginStore.hasAccess(API.AccessEnum.SETTINGS_EDIT);
    return (
      <>
        <VirtualTable
          store={ ShareRootStore }
          customFilter={ ShareProfileFilter }
          footerData={ 
            <ActionMenu 
              className="top left pointing"
              caption={ translate('Actions...') }
              actions={ ShareRootActions.create }
              header={ translate('Share actions') }
              triggerIcon="chevron up"
              ids={ [ 'create' ]}
              button={ true }
            >
              <ActionMenu 
                actions={ ShareActions }
                ids={ [ 'refresh' ]}
              />
            </ActionMenu>
          }
          moduleId={ ShareActions.moduleId }
        >
          <Column
            name="Path"
            width={200}
            columnKey="path"
            cell={
              <FileActionCell 
                actions={ ShareRootActions.edit }
                remoteMenuId={ MenuConstants.SHARE_ROOT }
              /> 
            }
            flexGrow={10}
          />
          <Column
            name="Size"
            width={60}
            columnKey="size"
            cell={ <SizeCell/> }
            flexGrow={2}
          />
          <Column
            name="Content"
            width={150}
            columnKey="type"
            hideWidth={1000}
          />
          <Column
            name="Virtual name"
            width={120}
            columnKey="virtual_name"
            flexGrow={5}
            //hideWidth={600}
          />
          <Column
            name="Profiles"
            width={65}
            columnKey="profiles"
          />
          <Column
            name="Last refreshed"
            width={80}
            flexGrow={3}
            columnKey="last_refresh_time"
            cell={ editAccess ? <RefreshCell/> : <DurationCell/> }
          />
        </VirtualTable>
        <ShareDirectoryDialog
          shareT={ this.shareT }
        />
      </>
    );
  }
}

export default withTranslation()(Share);