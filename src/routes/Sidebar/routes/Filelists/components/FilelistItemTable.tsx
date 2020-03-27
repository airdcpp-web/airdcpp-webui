import React, { useMemo } from 'react';

import FilelistItemActions from 'actions/ui/FilelistItemActions';

import { dupeToStringType } from 'utils/TypeConvert';
import { TableActionMenu } from 'components/menu';

import FilelistViewStore from 'stores/FilelistViewStore';
import FilelistSessionStore from 'stores/FilelistSessionStore';

import VirtualTable from 'components/table/VirtualTable';
import { SizeCell, DurationCell, FileDownloadCell, FileDownloadCellClickHandler } from 'components/table/Cell';
import { Column } from 'fixed-data-table-2';

import IconConstants from 'constants/IconConstants';
import Loader from 'components/semantic/Loader';
import Message from 'components/semantic/Message';

import * as API from 'types/api';
import * as UI from 'types/ui';

import { FilelistItemInfoDialog } from './item-info-dialog';
import { RowWrapperCellChildProps } from 'components/table/RowWrapperCell';
import { filelistDownloadHandler } from 'services/api/FilelistApi';
import MenuConstants from 'constants/MenuConstants';


interface NameCellProps extends RowWrapperCellChildProps<string, API.FilelistItem> {
  session: API.FilelistSession;
  onClickDirectory: FileDownloadCellClickHandler; 
}

const NameCell: React.FC<NameCellProps> = (
  { rowDataGetter, onClickDirectory, session, ...other }
) => {
  const itemDataGetter = useMemo(
    () => {
      return () => ({
        item: rowDataGetter!(),
        session
      });
    },
    [ session ]
  );

  return (
    <FileDownloadCell 
      clickHandlerGetter={ onClickDirectory }
      userGetter={ () => session.user }
      downloadHandler={ filelistDownloadHandler }
      rowDataGetter={ rowDataGetter }
      session={ session }
      entityId={ session.id }
      remoteMenuId={ MenuConstants.FILELIST_ITEM }
      { ...other }
    >
      <TableActionMenu 
        actions={ FilelistItemActions }
        itemData={ itemDataGetter }
        ids={ [ 'refreshShare', 'details' ] }
      />
    </FileDownloadCell>
  );
};


interface ListBrowserProps {
  session: API.FilelistSession;
  onClickDirectory: (path: string) => void; 
  sessionT: UI.ModuleTranslator;
}

class FilelistItemTable extends React.Component<ListBrowserProps> {
  rowClassNameGetter = (rowData: API.FilelistItem) => {
    return dupeToStringType(rowData.dupe);
  }

  emptyRowsNodeGetter = () => {
    const { location, state } = this.props.session;
    const { translate } = this.props.sessionT;

    if (state.id === 'download_failed') {
      return (
        <Message 
          icon={ IconConstants.ERROR }
          title={ translate('Download failed') }
          description={ state.str }
        />
      );
    }

    // The list finished downloading but the view hasn't updated yet
    const { files, directories } = location!.type as API.DirectoryType;
    if (files !== 0 || directories !== 0) {
      return <Loader text={ translate('Updating view') }/>;
      //return null;
    }

    // The directory was changed but the download state hasn't changed yet
    if (!location!.complete) {
      return <Loader text={ translate('Preparing download') }/>;
    }

    return (
      <Message 
        title={ translate('No content to display') }
        description={ translate('The directory is empty') }
      />
    );
  }

  onClickDirectory: FileDownloadCellClickHandler = (cellData, rowDataGetter) => {
    if (rowDataGetter().type.id === 'directory') {
      return () => this.props.onClickDirectory(this.props.session.location!.path + cellData + '/');
    }

    return undefined;
  }

  userGetter = () => {
    return this.props.session.user;
  }

  render() {
    const { session } = this.props;
    return (
      <>
        <VirtualTable
          emptyRowsNodeGetter={ this.emptyRowsNodeGetter }
          rowClassNameGetter={ this.rowClassNameGetter }
          store={ FilelistViewStore }
          entityId={ session.id }
          viewId={ session.location!.path }
          sessionStore={ FilelistSessionStore }
          moduleId={ FilelistItemActions.moduleId }
        >
          <Column
            name="Name"
            width={200}
            columnKey="name"
            cell={
              <NameCell 
                onClickDirectory={ this.onClickDirectory } 
                session={ session }
              />
            }
            flexGrow={8}
          />
          <Column
            name="Size"
            width={60}
            columnKey="size"
            cell={ <SizeCell/> }
            flexGrow={1}
          />
          <Column
            name="Type"
            width={70}
            columnKey="type"
            flexGrow={1}
            hideWidth={ 500 }
          />
          <Column
            name="Last modified"
            width={80}
            columnKey="time"
            cell={ <DurationCell/> }
            flexGrow={1}
          />
        </VirtualTable>
        <FilelistItemInfoDialog
          session={ session }
        />
      </>
    );
  }
}

export default FilelistItemTable;
