import React from 'react';

import SearchActions from 'actions/SearchActions';
import SearchViewStore from 'stores/SearchViewStore';

import { Column } from 'fixed-data-table-2';
import VirtualTable from 'components/table/VirtualTable';
import { SizeCell, DurationCell, ConnectionCell, FileDownloadCell, DecimalCell } from 'components/table/Cell';
import { TableActionMenu } from 'components/menu/DropdownMenu';

import { dupeToStringType } from 'utils/TypeConvert';
import { TableUserMenu } from 'components/menu/DropdownMenu';
import { UserFileActions } from 'actions/UserActions';
import Message from 'components/semantic/Message';

import DownloadDialog from 'components/download/DownloadDialog';
import ResultDialog, { SearchResultGetter } from 'routes/Search/components/ResultDialog';
import { RowWrapperCellChildProps } from 'components/table/RowWrapperCell';

import * as API from 'types/api';


const getUserCaption = ({ count, user }: API.SearchResultUserInfo) => {
  return count > 1 ? `${count} users (${user.nicks})` : user.nicks;
};

const UserCell: React.SFC<RowWrapperCellChildProps<API.SearchResultUserInfo, API.GroupedSearchResult>> = (
  { cellData, rowDataGetter }
) => (
  <TableUserMenu 
    text={ getUserCaption(cellData!) } 
    user={ cellData!.user }
    directory={ rowDataGetter!().path }
    userIcon="simple"
    ids={ UserFileActions }
  />
);

const resultUserGetter = (rowData: API.GroupedSearchResult) => rowData.users.user;

const NameCell: React.SFC<RowWrapperCellChildProps<string, API.GroupedSearchResult>> = (
  { rowDataGetter, ...props }
) => (
  <FileDownloadCell 
    userGetter={ resultUserGetter }
    rowDataGetter={ rowDataGetter }
    downloadHandler={ SearchActions.download }
    { ...props }
  >
    <TableActionMenu 
      actions={ SearchActions }
      itemData={ rowDataGetter }
    />
  </FileDownloadCell>
);

export interface ResultTableProps {
  running: boolean;
  searchString: string;
}

class ResultTable extends React.Component<ResultTableProps> {
  static displayName = 'ResultTable';

  rowClassNameGetter = (rowData: API.GroupedSearchResult) => {
    return dupeToStringType(rowData.dupe);
  }

  emptyRowsNodeGetter = () => {
    const { running, searchString } = this.props;
    if (running) {
      return null;
    }

    if (!searchString) {
      return process.env.DEMO_MODE === '1' && (
        <Message 
          title="Demo content available"
          icon="idea"
          description={ 'Use the search string "demo" to receive results from the demo share' }
        />
      );
    }

    return (
      <Message 
        title={ `No results found for "${searchString}"` }
        description={ (
          <div className="ui bulleted list">
            <div className="item">Ensure that you spelled the words correctly</div>
            <div className="item">Use different keywords</div>
            <div className="item">You are searching too frequently (hubs often have a minimum search interval)</div>
            <div className="item">
              If you never receive results for common search terms, 
              make sure that your connectivity settings are configured properly
            </div>
          </div>
        ) }
      />
    );
  }

  render() {
    return (
      <>
        <VirtualTable
          emptyRowsNodeGetter={ this.emptyRowsNodeGetter }
          rowClassNameGetter={ this.rowClassNameGetter }
          store={ SearchViewStore }
          textFilterProps={{
            autoFocus: false,
          }}
        >
          <Column
            name="Name"
            width={200}
            columnKey="name"
            flexGrow={8}
            cell={ <NameCell/> }
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
            width={80}
            columnKey="type"
            flexGrow={1}
            hideWidth={600}
          />
          <Column
            name="Relevance"
            width={60}
            columnKey="relevance"
            cell={ <DecimalCell/> }
            flexGrow={1}
          />
          <Column
            name="Connection"
            width={60}
            columnKey="connection"
            cell={ <ConnectionCell/> }
            flexGrow={2}
            hideWidth={600}
          />
          <Column
            name="Users"
            width={120}
            columnKey="users"
            flexGrow={3}
            cell={ <UserCell/> }
            hideWidth={600}
          />
          <Column
            name="Last modified"
            width={80}
            columnKey="time"
            cell={ <DurationCell/> }
            flexGrow={1}
            hideWidth={800}
          />
          <Column
            name="Slots"
            width={60}
            columnKey="slots"
            flexGrow={1}
            hideWidth={800}
          />
        </VirtualTable>
        <DownloadDialog 
          downloadHandler={ SearchActions.download }
          itemDataGetter={ SearchResultGetter }
        />
        <ResultDialog/>
      </>
    );
  }
}

export default ResultTable;