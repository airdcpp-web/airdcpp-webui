import * as React from 'react';

import { dupeToStringType } from '@/utils/TypeConvert';
import { TableActionMenu } from '@/components/action-menu';

import FilelistViewStore from '@/stores/views/FilelistViewStore';

import VirtualTable from '@/components/table/VirtualTable';
import {
  SizeCell,
  DurationCell,
  FileDownloadCell,
  FileDownloadCellClickHandler,
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

interface NameCellProps extends RowWrapperCellChildProps<string, API.FilelistItem> {
  filelist: API.FilelistSession;
  onClickDirectory: FileDownloadCellClickHandler;
}

const NameCell: React.FC<NameCellProps> = ({
  rowDataGetter,
  onClickDirectory,
  filelist,
  ...other
}) => {
  return (
    <FileDownloadCell
      clickHandlerGetter={onClickDirectory}
      userGetter={() => filelist.user}
      downloadHandler={filelistDownloadHandler}
      rowDataGetter={rowDataGetter}
      entity={filelist}
      remoteMenuId={MenuConstants.FILELIST_ITEM}
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
  const rowClassNameGetter = (rowData: API.FilelistItem) => {
    // Don't highlight dupes in own filelist...
    const isOwnList = filelist.user.flags.includes('self');
    return isOwnList ? '' : dupeToStringType(rowData.dupe);
  };

  const emptyRowsNodeGetter = () => {
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
  };

  const handleClickDirectory: FileDownloadCellClickHandler = (
    cellData,
    rowDataGetter,
  ) => {
    if (rowDataGetter().type.id === 'directory') {
      return () => onClickDirectory(filelist.location!.path + cellData + '/');
    }

    return undefined;
  };

  // const { session } = this.props;
  const sessionStore = useSessionStore();
  return (
    <>
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
      >
        <Column
          name="Name"
          width={200}
          columnKey="name"
          cell={<NameCell onClickDirectory={handleClickDirectory} filelist={filelist} />}
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
    </>
  );
};

export default FilelistItemTable;
