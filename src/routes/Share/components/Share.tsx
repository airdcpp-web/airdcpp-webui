import React, { Fragment } from 'react';

import ShareActions from 'actions/ShareActions';
import ShareRootActions from 'actions/ShareRootActions';
import ShareRootStore from 'stores/ShareRootStore';

import VirtualTable from 'components/table/VirtualTable';
import { SizeCell, DurationCell, FileActionCell } from 'components/table/Cell';
import { Column } from 'fixed-data-table-2';

import ShareDirectoryDialog from 'routes/Share/components/ShareDirectoryDialog';
import ShareProfileFilter from 'components/table/ShareProfileFilter';

import { ActionMenu } from 'components/menu/DropdownMenu';
import RefreshCell from 'routes/Share/components/RefreshCell';

import AccessConstants from 'constants/AccessConstants';
import LoginStore from 'stores/LoginStore';


class Share extends React.Component {
  static displayName = 'Share';

  render() {
    const editAccess = LoginStore.hasAccess(AccessConstants.SETTINGS_EDIT);
    return (
      <Fragment>
        <VirtualTable
          store={ ShareRootStore }
          customFilter={ <ShareProfileFilter/> }
          footerData={ 
            <ActionMenu 
              className="top left pointing"
              caption="Actions..." 
              actions={ ShareRootActions }
              header="Share actions"
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
        >
          <Column
            name="Path"
            width={200}
            columnKey="path"
            cell={
              <FileActionCell 
                actions={ ShareRootActions }
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
        <ShareDirectoryDialog/>
      </Fragment>
    );
  }
}

export default Share;