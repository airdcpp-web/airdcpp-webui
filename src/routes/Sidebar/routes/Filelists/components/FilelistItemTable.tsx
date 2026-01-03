import * as React from 'react';
import { useCallback } from 'react';

import { dupeToStringType } from '@/utils/TypeConvert';
import { TableActionMenu } from '@/components/action-menu';

import FilelistViewStore from '@/stores/views/FilelistViewStore';

import VirtualTable from '@/components/table/VirtualTable';
import {
  SizeCell,
  DurationCell,
  FileDownloadCell,
  FileDownloadCellCaptionGetter,
} from '@/components/table/Cell';
import { Column } from 'fixed-data-table-2';

import IconConstants from '@/constants/IconConstants';
import Loader from '@/components/semantic/Loader';
import Message from '@/components/semantic/Message';

import * as API from '@/types/api';
import * as UI from '@/types/ui';

import { FilelistItemInfoDialog } from './item-info-dialog';
import { RowWrapperCellChildProps } from '@/components/table/RowWrapperCell';
import { filelistDownloadHandler } from '@/services/api/FilelistApi';
import MenuConstants from '@/constants/MenuConstants';
import { FilelistItemActionMenu } from '@/actions/ui/filelist';
import { useSessionStore } from '@/context/SessionStoreContext';
import LinkButton from '@/components/semantic/LinkButton';
import { noMouseFocusProps } from '@/utils/BrowserUtils';
import BulkDownloadDialog from '@/components/download/BulkDownloadDialog';

import {
  useTableSelection,
  useSelectionActions,
  TableSelectionProvider,
  SelectionCheckboxCell,
  SelectionHeaderCell,
  SelectionFooterBar,
} from '@/components/table/selection';
import FilterOptionsButton from '@/components/table/FilterOptionsButton';
import FilelistConstants from '@/constants/FilelistConstants';
import { SelectionActionMenu } from '@/actions/ui/selection';

interface NameCellProps extends RowWrapperCellChildProps<string, API.FilelistItem> {
  filelist: API.FilelistSession;
  captionGetter: FileDownloadCellCaptionGetter;
}

const NameCell: React.FC<NameCellProps> = ({
  rowDataGetter,
  captionGetter,
  filelist,
  cellData,
  ...other
}) => {
  return (
    <FileDownloadCell
      userGetter={() => filelist.user}
      downloadHandler={filelistDownloadHandler}
      rowDataGetter={rowDataGetter}
      entity={filelist}
      remoteMenuId={MenuConstants.FILELIST_ITEM}
      captionGetter={captionGetter}
      triggerProps={{
        'aria-label': `${cellData} actions`,
      }}
      cellData={cellData}
      {...other}
    >
      <TableActionMenu
        actions={FilelistItemActionMenu}
        itemData={rowDataGetter}
        ids={['refreshShare', 'details']}
        entity={filelist}
      />
    </FileDownloadCell>
  );
};

interface ListBrowserProps {
  filelist: API.FilelistSession;
  onClickDirectory: (path: string) => void;
  sessionT: UI.ModuleTranslator;
}

const FilelistItemTable: React.FC<ListBrowserProps> = ({
  filelist,
  sessionT,
  onClickDirectory,
  ...other
}) => {
  const selection = useTableSelection({
    entityId: filelist.id,
    viewId: filelist.location!.path,
  });
  const {
    showBulkDownload,
    selectedItems,
    getSelectionData,
    getTotalCount,
    handleBulkDownload,
    handleBulkDownloadClose,
  } = useSelectionActions<API.FilelistItem>({ selection, store: FilelistViewStore });

  // Handle bulk action clicks - intercept download to open dialog
  const handleBulkActionClick = useCallback(
    (actionId: string) => {
      if (actionId === 'download' || actionId === 'downloadTo') {
        handleBulkDownload();
        return true; // Prevent default handler
      }
      return false;
    },
    [handleBulkDownload],
  );

  const rowClassNameGetter = useCallback(
    (rowData: API.FilelistItem) => {
      // Don't highlight dupes in own filelist...
      const isOwnList = filelist.user.flags.includes('self');
      return isOwnList ? '' : dupeToStringType(rowData.dupe);
    },
    [filelist.user.flags]
  );

  const emptyRowsNodeGetter = useCallback(() => {
    const { location, state } = filelist;
    const { translate } = sessionT;

    if (state.id === 'download_failed') {
      return (
        <Message
          icon={IconConstants.ERROR}
          title={translate('Download failed')}
          description={state.str}
        />
      );
    }

    // The list finished downloading but the view hasn't updated yet
    const { files, directories } = location!.type as API.DirectoryType;
    if (files !== 0 || directories !== 0) {
      return <Loader text={translate('Updating view')} />;
    }

    // The directory was changed but the download state hasn't changed yet
    if (!location!.complete) {
      return <Loader text={translate('Preparing download')} />;
    }

    return (
      <Message
        title={translate('No content to display')}
        description={translate('The directory is empty')}
      />
    );
  }, [filelist, sessionT]);

  const getNameCellCaption: FileDownloadCellCaptionGetter = useCallback(
    (cellData, rowDataGetter) => {
      if (rowDataGetter().type.id === 'directory') {
        const onClick = () => onClickDirectory(filelist.location!.path + cellData + '/');
        return (
          <LinkButton onClick={onClick} {...noMouseFocusProps}>
            {cellData}
          </LinkButton>
        );
      }

      return cellData;
    },
    [filelist.location, onClickDirectory]
  );

  const sessionStore = useSessionStore();
  return (
    <TableSelectionProvider value={selection}>
      <VirtualTable
        emptyRowsNodeGetter={emptyRowsNodeGetter}
        rowClassNameGetter={rowClassNameGetter}
        store={FilelistViewStore}
        entityId={filelist.id}
        viewId={filelist.location!.path}
        sessionStore={sessionStore.filelists}
        moduleId={UI.Modules.FILELISTS}
        textFilterProps={{
          autoFocus: true,
        }}
        footerData={
          <SelectionFooterBar
            actions={SelectionActionMenu}
            items={selectedItems}
            entity={filelist}
            t={sessionT.t}
            onActionClick={handleBulkActionClick}
          >
            <FilterOptionsButton store={FilelistViewStore} />
          </SelectionFooterBar>
        }
      >
        <Column
          name=""
          width={40}
          columnKey="__selection"
          flexGrow={0}
          header={<SelectionHeaderCell totalCountGetter={getTotalCount} />}
          cell={<SelectionCheckboxCell />}
        />
        <Column
          name="Name"
          width={200}
          columnKey="name"
          cell={<NameCell captionGetter={getNameCellCaption} filelist={filelist} />}
          flexGrow={8}
        />
        <Column
          name="Size"
          width={60}
          columnKey="size"
          cell={<SizeCell />}
          flexGrow={1}
        />
        <Column name="Type" width={70} columnKey="type" flexGrow={1} hideWidth={500} />
        <Column
          name="Last modified"
          width={80}
          columnKey="time"
          cell={<DurationCell />}
          flexGrow={1}
        />
      </VirtualTable>
      <FilelistItemInfoDialog filelist={filelist} />
      {showBulkDownload && (
        <BulkDownloadDialog
          selectionData={getSelectionData()}
          bulkApiUrl={`${FilelistConstants.SESSIONS_URL}/${filelist.user.cid}/items/download`}
          sessionItem={filelist}
          onClose={handleBulkDownloadClose}
        />
      )}
    </TableSelectionProvider>
  );
};

export default FilelistItemTable;
