import * as React from 'react';
import { useState, useCallback, useMemo } from 'react';

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
import BulkDownloadDialog from '@/components/download/BulkDownloadDialog';
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

import {
  useTableSelection,
  TableSelectionProvider,
  SelectionCheckboxCell,
  SelectionHeaderCell,
  SelectionFooterBar,
} from '@/components/table/selection';
import DupeFilterToggles from '@/components/table/DupeFilterToggles';

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

const ResultTable: React.FC<ResultTableProps> = ({
  running,
  searchString,
  searchT,
  instance,
}) => {
  const [showBulkDownload, setShowBulkDownload] = useState(false);
  const selection = useTableSelection({ entityId: instance.id });
  const { translate } = searchT;

  const rowClassNameGetter = useCallback((rowData: API.GroupedSearchResult) => {
    return dupeToStringType(rowData.dupe);
  }, []);

  const emptyRowsNodeGetter = useCallback(() => {
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
  }, [running, searchString, searchT]);

  const itemDataGetter: UI.DownloadItemDataGetter<API.GroupedSearchResult> = useCallback(
    (itemId, socket) => {
      return socket.get(
        `${SearchConstants.INSTANCES_URL}/${instance.id}/results/${itemId}`
      );
    },
    [instance.id]
  );

  // Get total count from store for select-all
  const getTotalCount = useCallback(() => {
    return SearchViewStore.rowCount || 0;
  }, []);

  // Memoize selected items directly to avoid unstable function reference
  const selectedItems = useMemo(() => {
    const items = SearchViewStore.items || [];
    if (selection.selectAllMode) {
      // In select-all mode, return all loaded items except excluded ones
      return items.filter(
        (item: API.GroupedSearchResult) => item && !selection.excludedIds.has(item.id)
      );
    }
    return items.filter(
      (item: API.GroupedSearchResult) => item && selection.selectedIds.has(item.id)
    );
  }, [selection.selectAllMode, selection.excludedIds, selection.selectedIds]);

  const handleBulkDownload = useCallback(() => {
    setShowBulkDownload(true);
  }, []);

  const handleBulkDownloadClose = useCallback(() => {
    setShowBulkDownload(false);
    selection.clearSelection();
  }, [selection]);

  return (
    <TableSelectionProvider value={selection}>
      <VirtualTable
        emptyRowsNodeGetter={emptyRowsNodeGetter}
        rowClassNameGetter={rowClassNameGetter}
        store={SearchViewStore}
        textFilterProps={{
          autoFocus: false,
        }}
        entityId={instance.id}
        moduleId={UI.Modules.SEARCH}
        footerData={
          <>
            <SelectionFooterBar
              onDownload={handleBulkDownload}
              t={searchT.t}
            >
              <DupeFilterToggles store={SearchViewStore} />
            </SelectionFooterBar>
            <ActionMenu
              className="top left pointing"
              caption={translate('Actions...')}
              actions={SearchActionMenu}
              header={translate('Search actions')}
              triggerIcon="chevron up"
              button={true}
              itemData={instance}
              remoteMenuId={MenuConstants.SEARCH_INSTANCE}
            />
          </>
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
        itemDataGetter={itemDataGetter}
        sessionItem={instance}
      />
      <ResultDialog searchT={searchT} instance={instance} />
      {showBulkDownload && selectedItems.length > 0 && (
        <BulkDownloadDialog
          items={selectedItems}
          downloadHandler={searchDownloadHandler}
          sessionItem={instance}
          userGetter={resultUserGetter}
          onClose={handleBulkDownloadClose}
        />
      )}
    </TableSelectionProvider>
  );
};

ResultTable.displayName = 'ResultTable';

export default ResultTable;
