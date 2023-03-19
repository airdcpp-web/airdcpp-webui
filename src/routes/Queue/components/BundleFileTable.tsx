import * as React from 'react';
import { Column } from 'fixed-data-table-2';

import QueueFileUIActions from 'actions/ui/QueueFileActions';

import VirtualTable from 'components/table/VirtualTable';

import PriorityMenu from 'routes/Queue/components/PriorityMenu';
import StatusCell from 'routes/Queue/components/StatusCell';

import QueueFileViewStore from 'stores/QueueFileViewStore';

import {
  FileActionCell,
  SizeCell,
  SpeedCell,
  AbbreviatedDurationCell,
} from 'components/table/Cell';

import '../style.css';
import { RowWrapperCellChildProps } from 'components/table/RowWrapperCell';

import * as API from 'types/api';
import { setFilePriority } from 'services/api/QueueApi';
import MenuConstants from 'constants/MenuConstants';

const PriorityCell: React.FC<
  RowWrapperCellChildProps<API.QueuePriority, API.QueueBundle>
> = ({ cellData, rowDataGetter, t }) => (
  <PriorityMenu
    itemPrio={cellData!}
    item={rowDataGetter!()}
    prioAction={setFilePriority}
    t={t!}
  />
);

interface BundleFileTableProps {
  bundle: API.QueueBundle;
}

class BundleFileTable extends React.Component<BundleFileTableProps> {
  isActive = (cellData: any, rowData: API.QueueFile) => {
    return !rowData.status.downloaded;
  };

  isRunning = (cellData: any, rowData: API.QueueFile) => {
    return rowData.speed > 0;
  };

  render() {
    return (
      <VirtualTable
        store={QueueFileViewStore}
        sourceFilter={{
          pattern: this.props.bundle.id,
          method: API.FilterMethod.EXACT,
          property: 'bundle',
        }}
        moduleId={QueueFileUIActions.moduleId}
      >
        <Column
          name="Name"
          width={200}
          flexGrow={20}
          columnKey="name"
          cell={
            <FileActionCell
              actions={QueueFileUIActions}
              remoteMenuId={MenuConstants.QUEUE_FILE}
            />
          }
        />
        <Column
          name="Size"
          width={70}
          columnKey="size"
          cell={<SizeCell />}
          flexGrow={1}
        />
        <Column name="Status" width={120} columnKey="status" cell={<StatusCell />} />
        <Column
          name="Sources"
          width={65}
          columnKey="sources"
          renderCondition={this.isActive}
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
          width={55}
          columnKey="speed"
          cell={<SpeedCell />}
          renderCondition={this.isRunning}
        />
        <Column
          name="Priority"
          width={80}
          columnKey="priority"
          renderCondition={this.isActive}
          cell={<PriorityCell />}
          flexGrow={1}
        />
      </VirtualTable>
    );
  }
}

export default BundleFileTable;
