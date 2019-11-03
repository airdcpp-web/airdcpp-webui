import React from 'react';

import SearchActions from 'actions/ui/SearchActions';

import { ResultDialog, SearchResultGetter } from './result-dialog';

import SearchViewStore from 'stores/SearchViewStore';

import { Column } from 'fixed-data-table-2';
import VirtualTable from 'components/table/VirtualTable';
import { SizeCell, DurationCell, ConnectionCell, FileDownloadCell, DecimalCell } from 'components/table/Cell';
import { TableActionMenu } from 'components/menu';

import { dupeToStringType } from 'utils/TypeConvert';
import { TableUserMenu } from 'components/menu';
import { UserFileActions } from 'actions/ui/UserActions';
import Message from 'components/semantic/Message';

import DownloadDialog from 'components/download/DownloadDialog';
import { RowWrapperCellChildProps } from 'components/table/RowWrapperCell';

import * as API from 'types/api';
import * as UI from 'types/ui';

import { TFunction } from 'i18next';
import { Trans } from 'react-i18next';
import { toI18nKey } from 'utils/TranslationUtils';
import { searchDownloadHandler } from 'services/api/SearchApi';
import IconConstants from 'constants/IconConstants';


const getUserCaption = ({ count, user }: API.SearchResultUserInfo, t: TFunction) => {
  if (count > 1) {
    return t(toI18nKey('xUsersNicks', UI.Modules.SEARCH), {
      defaultValue: `{{count}} user ({{user.nicks}})`,
      defaultValue_plural: `{{count}} users ({{user.nicks}})`,
      count,
      replace: {
        count,
        user
      }
    });
  }

  return user.nicks;
};

const UserCell: React.FC<RowWrapperCellChildProps<API.SearchResultUserInfo, API.GroupedSearchResult>> = (
  { cellData, rowDataGetter, t }
) => (
  <TableUserMenu 
    text={ getUserCaption(cellData!, t!) } 
    user={ cellData!.user }
    directory={ rowDataGetter!().path }
    userIcon="simple"
    ids={ UserFileActions }
  >
    <TableActionMenu 
      actions={ SearchActions }
      itemData={ rowDataGetter }
      ids={ [ 'result' ] }
    />
  </TableUserMenu>
);

const resultUserGetter = (rowData: API.GroupedSearchResult) => {
  if (!rowData || !rowData.users) {
    return rowData.users.user;
  }

  return rowData.users.user;
};

const NameCell: React.FC<RowWrapperCellChildProps<string, API.GroupedSearchResult>> = (
  { rowDataGetter, ...props }
) => (
  <FileDownloadCell 
    userGetter={ resultUserGetter }
    rowDataGetter={ rowDataGetter }
    downloadHandler={ searchDownloadHandler }
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
  searchT: UI.ModuleTranslator;
}

class ResultTable extends React.Component<ResultTableProps> {
  static displayName = 'ResultTable';

  rowClassNameGetter = (rowData: API.GroupedSearchResult) => {
    return dupeToStringType(rowData.dupe);
  }

  emptyRowsNodeGetter = () => {
    const { running, searchString, searchT } = this.props;
    if (running) {
      return null;
    }

    if (!searchString) {
      return process.env.DEMO_MODE === '1' && (
        <Message 
          title="Demo content available"
          icon={ IconConstants.TIP }
          description={ 'Use the search string "demo" to receive results from the demo share' }
        />
      );
    }

    return (
      <Message 
        title={ searchT.t('noResults', {
          defaultValue: `No results found for "{{searchString}}"`,
          replace: {
            searchString
          }
        }) }
        description={ (
          <Trans i18nKey={ searchT.toI18nKey('noResultsHint') }>
            <div className="ui bulleted list">
              <div className="item">Ensure that you spelled the words correctly</div>
              <div className="item">Use different keywords</div>
              <div className="item">You are searching too frequently (hubs often have a minimum search interval)</div>
              <div className="item">
                If you never receive results for common search terms, 
                make sure that your connectivity settings are configured properly
              </div>
            </div>
          </Trans>
        ) }
      />
    );
  }

  render() {
    const { searchT } = this.props;
    return (
      <>
        <VirtualTable
          emptyRowsNodeGetter={ this.emptyRowsNodeGetter }
          rowClassNameGetter={ this.rowClassNameGetter }
          store={ SearchViewStore }
          textFilterProps={{
            autoFocus: false,
          }}
          moduleId={ SearchActions.moduleId }
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
          downloadHandler={ searchDownloadHandler }
          itemDataGetter={ SearchResultGetter }
        />
        <ResultDialog searchT={ searchT }/>
      </>
    );
  }
}

export default ResultTable;