import * as React from 'react';
import { Column } from 'fixed-data-table-2';

import QueueActions from 'actions/ui/QueueActions';
import QueueBundleActions from 'actions/ui/QueueBundleActions';
import VirtualTable from 'components/table/VirtualTable';

import PriorityMenu from 'routes/Queue/components/PriorityMenu';
import StatusCell from 'routes/Queue/components/StatusCell';
import QueueBundleViewStore from 'stores/QueueBundleViewStore';

import BundleFileDialog from 'routes/Queue/components/BundleFileDialog';
import SourceDialog from 'routes/Queue/components/BundleSourceDialog';

import { ActionMenu } from 'components/menu';
import Message from 'components/semantic/Message';

import {
  ActionLinkCell,
  FileActionCell,
  SizeCell,
  SpeedCell,
  AbbreviatedDurationCell,
  DurationCell,
} from 'components/table/Cell';

import '../style.css';
import { RowWrapperCellChildProps } from 'components/table/RowWrapperCell';

import * as API from 'types/api';
import * as UI from 'types/ui';

import { withTranslation, WithTranslation } from 'react-i18next';
import { getModuleT } from 'utils/TranslationUtils';
import { setBundlePriority } from 'services/api/QueueApi';
import IconConstants from 'constants/IconConstants';
import MenuConstants from 'constants/MenuConstants';

const PriorityCell: React.FC<
  RowWrapperCellChildProps<API.QueuePriority, API.QueueBundle>
> = ({ cellData, rowDataGetter, t }) => (
  <PriorityMenu
    itemPrio={cellData!}
    item={rowDataGetter!()}
    prioAction={setBundlePriority}
    t={t!}
  />
);

class Queue extends React.Component<WithTranslation> {
  static displayName = 'Queue';

  isActive = (cellData: any, rowData: API.QueueBundle) => {
    return !rowData.status.downloaded;
  };

  isDownloaded = (cellData: any, rowData: API.QueueBundle) => {
    return rowData.status.downloaded;
  };

  isRunning = (cellData: any, rowData: API.QueueBundle) => {
    return rowData.speed > 0;
  };

  emptyRowsNodeGetter = () => {
    const { t } = this.queueT;
    return (
      <Message
        title={t('queueEmpty', 'The queue is empty')}
        icon={IconConstants.FILE}
        description={t<string>(
          'queueEmptyDesc',
          'New items can be queued from search or filelists'
        )}
      />
    );
  };

  queueT = getModuleT(this.props.t, UI.Modules.QUEUE);
  render() {
    const { translate } = this.queueT;
    return (
      <>
        <VirtualTable
          emptyRowsNodeGetter={this.emptyRowsNodeGetter}
          store={QueueBundleViewStore}
          footerData={
            <ActionMenu
              className="top left pointing"
              caption={translate('Actions...')}
              actions={QueueActions}
              header={translate('Queue actions')}
              triggerIcon="chevron up"
              button={true}
            />
          }
          moduleId={QueueActions.moduleId}
        >
          <Column
            name="Name"
            width={200}
            flexGrow={4}
            columnKey="name"
            cell={
              <FileActionCell
                actions={QueueBundleActions}
                remoteMenuId={MenuConstants.QUEUE_BUNDLE}
                ids={[
                  'content',
                  'sources',
                  'divider',
                  'search',
                  'searchBundleAlternates',
                  'divider',
                  'removeBundle',
                  'divider',
                  'rescan',
                  'forceShare',
                ]}
              />
            }
          />
          <Column
            name="Size"
            width={60}
            columnKey="size"
            cell={<SizeCell />}
            flexGrow={1}
          />
          <Column
            name="Type/content"
            width={150}
            columnKey="type"
            hideWidth={1000}
            cell={<ActionLinkCell actions={QueueBundleActions} actionId="content" />}
          />
          <Column
            name="Status"
            width={120}
            flexGrow={3}
            columnKey="status"
            cell={<StatusCell />}
          />
          <Column
            name="Sources"
            width={60}
            columnKey="sources"
            renderCondition={this.isActive}
            flexGrow={1}
            cell={<ActionLinkCell actions={QueueBundleActions} actionId="sources" />}
          />
          <Column
            name="Time left"
            width={50}
            columnKey="seconds_left"
            renderCondition={this.isRunning}
            cell={<AbbreviatedDurationCell />}
          />
          <Column
            name="Speed"
            width={50}
            columnKey="speed"
            cell={<SpeedCell />}
            renderCondition={this.isRunning}
            flexGrow={1}
          />
          <Column
            name="Priority"
            width={80}
            columnKey="priority"
            renderCondition={this.isActive}
            cell={<PriorityCell />}
            flexGrow={1}
          />
          <Column
            name="Added"
            width={100}
            columnKey="time_added"
            cell={<DurationCell />}
            hideWidth={1400}
          />
          <Column
            name="Finished"
            width={100}
            columnKey="time_finished"
            cell={<DurationCell />}
            renderCondition={this.isDownloaded}
            hideWidth={1200}
          />
        </VirtualTable>
        <SourceDialog queueT={this.queueT} />
        <BundleFileDialog />
      </>
    );
  }
}

export default withTranslation()(Queue);
