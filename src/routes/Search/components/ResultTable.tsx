import * as React from 'react';

import { ResultDialog } from './result-dialog';

import SearchViewStore from '@/stores/views/SearchViewStore';

import { Column } from 'fixed-data-table-2';
import VirtualTable from '@/components/table/VirtualTable';
import {
  SizeCell,
  DurationCell,
  ConnectionCell,
  FileDownloadCell,
  DecimalCell,
} from '@/components/table/Cell';
import { ActionMenu, TableActionMenu, TableUserMenu } from '@/components/action-menu';

import { dupeToStringType } from '@/utils/TypeConvert';
import { UserFileActions } from '@/actions/ui/user/UserActions';
import Message from '@/components/semantic/Message';

import DownloadDialog from '@/components/download/DownloadDialog';
import { RowWrapperCellChildProps } from '@/components/table/RowWrapperCell';

import * as API from '@/types/api';
import * as UI from '@/types/ui';

import { Trans } from 'react-i18next';
import { toI18nKey } from '@/utils/TranslationUtils';
import { searchDownloadHandler } from '@/services/api/SearchApi';
import IconConstants from '@/constants/IconConstants';
import MenuConstants from '@/constants/MenuConstants';
import SearchConstants from '@/constants/SearchConstants';
import { GroupedSearchResultActionMenu, SearchActionMenu } from '@/actions/ui/search';

export const getGroupedResultUserCaption = (
  { count, user }: API.SearchResultUserInfo,
  t: UI.TranslateF,
) => {
  if (count > 1) {
    return t(toI18nKey('xUsersNicks', UI.Modules.SEARCH), {
      defaultValue: `{{count}} user ({{user.nicks}})`,
      defaultValue_plural: `{{count}} users ({{user.nicks}})`,
      count,
      replace: {
        count,
        user,
      },
    });
  }

  return user.nicks;
};

const UserCell: React.FC<
  RowWrapperCellChildProps<API.SearchResultUserInfo, API.GroupedSearchResult>
> = ({ cellData, rowDataGetter, t }) => (
  <TableUserMenu
    text={getGroupedResultUserCaption(cellData!, t!)}
    user={cellData!.user}
    directory={rowDataGetter!().path}
    userIcon="simple"
    ids={UserFileActions}
    remoteMenuId={MenuConstants.HINTED_USER}
  >
    <TableActionMenu
      actions={GroupedSearchResultActionMenu}
      itemData={rowDataGetter}
      ids={['result']}
    />
  </TableUserMenu>
);

const resultUserGetter = (rowData: API.GroupedSearchResult) => {
  if (!rowData?.users) {
    return rowData?.users?.user;
  }

  return rowData.users.user;
};

interface NameCellProps
  extends RowWrapperCellChildProps<string, API.GroupedSearchResult> {
  instance: API.SearchInstance;
}

const NameCell: React.FC<NameCellProps> = ({ rowDataGetter, instance, ...props }) => (
  <FileDownloadCell
    userGetter={resultUserGetter}
    rowDataGetter={rowDataGetter}
    downloadHandler={searchDownloadHandler}
    entity={instance}
    {...props}
  >
    <TableActionMenu
      actions={GroupedSearchResultActionMenu}
      itemData={rowDataGetter}
      remoteMenuId={MenuConstants.GROUPED_SEARCH_RESULT}
      entity={instance}
    />
  </FileDownloadCell>
);

export interface ResultTableProps {
  running: boolean;
  searchString: string;
  searchT: UI.ModuleTranslator;
  instance: API.SearchInstance;
}

class ResultTable extends React.Component<ResultTableProps> {
  static readonly displayName = 'ResultTable';

  rowClassNameGetter = (rowData: API.GroupedSearchResult) => {
    return dupeToStringType(rowData.dupe);
  };

  emptyRowsNodeGetter = () => {
    const { running, searchString, searchT } = this.props;
    if (running) {
      return null;
    }

    if (!searchString) {
      return (
        isDemoInstance() && (
          <Message
            title="Demo content available"
            icon={IconConstants.TIP}
            description={
              'Use the search string "demo" to receive results from the demo share'
            }
          />
        )
      );
    }

    return (
      <Message
        title={searchT.t('noResults', {
          defaultValue: `No results found for "{{searchString}}"`,
          replace: {
            searchString,
          },
        })}
        description={
          <Trans i18nKey={searchT.toI18nKey('noResultsHint')}>
            <div className="ui bulleted list">
              <div className="item">Ensure that you spelled the words correctly</div>
              <div className="item">Use different keywords</div>
              <div className="item">
                You are searching too frequently (hubs often have a minimum search
                interval)
              </div>
              <div className="item">
                If you never receive results for common search terms, make sure that your
                connectivity settings are configured properly
              </div>
            </div>
          </Trans>
        }
      />
    );
  };

  itemDataGetter: UI.DownloadItemDataGetter<API.GroupedSearchResult> = (
    itemId,
    socket,
  ) => {
    const { instance } = this.props;
    return socket.get(
      `${SearchConstants.INSTANCES_URL}/${instance.id}/results/${itemId}`,
    );
  };

  render() {
    const { searchT, instance } = this.props;
    const { translate } = searchT;
    return (
      <>
        <VirtualTable
          emptyRowsNodeGetter={this.emptyRowsNodeGetter}
          rowClassNameGetter={this.rowClassNameGetter}
          store={SearchViewStore}
          textFilterProps={{
            autoFocus: false,
          }}
          entityId={instance.id}
          moduleId={UI.Modules.SEARCH}
          footerData={
            <ActionMenu
              className="top left pointing"
              caption={translate('Actions...')}
              actions={SearchActionMenu}
              header={translate('Search actions')}
              triggerIcon="chevron up"
              button={true}
              itemData={instance}
              remoteMenuId="search_instance"
            />
          }
        >
          <Column
            name="Name"
            width={200}
            columnKey="name"
            flexGrow={8}
            cell={<NameCell instance={instance} />}
          />
          <Column
            name="Size"
            width={60}
            columnKey="size"
            cell={<SizeCell />}
            flexGrow={1}
          />
          <Column name="Type" width={80} columnKey="type" flexGrow={1} hideWidth={600} />
          <Column
            name="Relevance"
            width={60}
            columnKey="relevance"
            cell={<DecimalCell />}
            flexGrow={1}
          />
          <Column
            name="Connection"
            width={60}
            columnKey="connection"
            cell={<ConnectionCell />}
            flexGrow={2}
            hideWidth={600}
          />
          <Column
            name="Users"
            width={120}
            columnKey="users"
            flexGrow={3}
            cell={<UserCell />}
            hideWidth={600}
          />
          <Column
            name="Last modified"
            width={80}
            columnKey="time"
            cell={<DurationCell />}
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
          downloadHandler={searchDownloadHandler}
          itemDataGetter={this.itemDataGetter}
          sessionItem={instance}
        />
        <ResultDialog searchT={searchT} instance={instance} />
      </>
    );
  }
}

export default ResultTable;
