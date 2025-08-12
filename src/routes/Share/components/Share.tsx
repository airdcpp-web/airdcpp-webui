import ShareRootStore from '@/stores/views/ShareRootStore';

import VirtualTable from '@/components/table/VirtualTable';
import { SizeCell, DurationCell, FileActionCell } from '@/components/table/Cell';
import { Column } from 'fixed-data-table-2';

import ShareDirectoryDialog from '@/routes/Share/components/ShareDirectoryDialog';
import ShareProfileFilter from '@/components/table/ShareProfileFilter';

import { ActionMenu } from '@/components/action-menu';
import RefreshCell from '@/routes/Share/components/RefreshCell';

import * as API from '@/types/api';
import * as UI from '@/types/ui';

import { useTranslation } from 'react-i18next';
import { getModuleT } from '@/utils/TranslationUtils';
import MenuConstants from '@/constants/MenuConstants';
import {
  ShareActionMenu,
  ShareRootActionModule,
  ShareRootCreateAction,
  ShareRootEditActionMenu,
} from '@/actions/ui/share';
import { useSession } from '@/context/AppStoreContext';
import { hasAccess } from '@/utils/AuthUtils';

const ShareRootCreateMenu = {
  actions: {
    create: ShareRootCreateAction,
  },
  moduleData: ShareRootActionModule,
};

const Share: React.FC = () => {
  const session = useSession();
  const { t } = useTranslation();
  const rowClassNameGetter = (rowData: API.ShareRootEntry) => {
    if (rowData.incoming) {
      return 'incoming';
    }

    return '';
  };

  const shareT = getModuleT(t, UI.Modules.SHARE);

  const { translate } = shareT;
  const editAccess = hasAccess(session, API.AccessEnum.SHARE_EDIT);
  return (
    <>
      <VirtualTable
        store={ShareRootStore}
        customFilter={ShareProfileFilter}
        rowClassNameGetter={rowClassNameGetter}
        footerData={
          <ActionMenu
            className="top left pointing"
            caption={translate('Actions...')}
            actions={ShareRootCreateMenu}
            header={translate('Share actions')}
            triggerIcon="chevron up"
            ids={['create']}
            button={true}
            remoteMenuId={MenuConstants.SHARE_ROOTS}
          >
            <ActionMenu actions={ShareActionMenu} ids={['refresh']} />
          </ActionMenu>
        }
        moduleId={UI.Modules.SHARE}
      >
        <Column
          name="Path"
          width={200}
          columnKey="path"
          cell={
            <FileActionCell
              actions={ShareRootEditActionMenu}
              remoteMenuId={MenuConstants.SHARE_ROOT}
            />
          }
          flexGrow={10}
        />
        <Column
          name="Size"
          width={60}
          columnKey="size"
          cell={<SizeCell />}
          flexGrow={2}
        />
        <Column name="Content" width={150} columnKey="type" hideWidth={1000} />
        <Column
          name="Virtual name"
          width={120}
          columnKey="virtual_name"
          flexGrow={5}
          //hideWidth={600}
        />
        <Column name="Profiles" width={65} columnKey="profiles" />
        <Column
          name="Last refreshed"
          width={80}
          flexGrow={3}
          columnKey="last_refresh_time"
          cell={editAccess ? <RefreshCell /> : <DurationCell />}
        />
      </VirtualTable>
      <ShareDirectoryDialog shareT={shareT} />
    </>
  );
};

export default Share;
