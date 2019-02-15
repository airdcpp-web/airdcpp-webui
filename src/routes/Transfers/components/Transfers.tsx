import React from 'react';

import TransferStore from 'stores/TransferStore';

import Message from 'components/semantic/Message';

import NameCell from 'routes/Transfers/components/NameCell';
import StatusCell from 'routes/Transfers/components/StatusCell';
import UserCell from 'routes/Transfers/components/UserCell';

import { Column } from 'fixed-data-table-2';
import VirtualTable from 'components/table/VirtualTable';
import { SizeCell, SpeedCell, AbbreviatedDurationCell, IpCell } from 'components/table/Cell';

import '../style.css';
import { RowWrapperCellChildProps } from 'components/table/RowWrapperCell';

import * as API from 'types/api';
import * as UI from 'types/ui';
import { withTranslation, WithTranslation } from 'react-i18next';
import { translate } from 'utils/TranslationUtils';


const FlagsCell: React.FC<RowWrapperCellChildProps<string[], API.Transfer>> = ({ cellData }) => (
  <span className="plain flags cell">
    { cellData!.join('') }
  </span>
);


interface TransfersProps extends WithTranslation {

}

class Transfers extends React.Component<TransfersProps> {
  static displayName = 'Transfers';

  isPositive = (cellData: number) => {
    return cellData > 0;
  }

  isRunning = (cellData: any, rowData: API.Transfer) => {
    return rowData.speed > 0;
  }

  emptyRowsNodeGetter = () => {
    const { t } = this.props;
    return (
      <Message 
        title={ translate('No active transfers', t, UI.Modules.TRANSFERS) }
        icon="exchange"
      />
    );
  }

  render() {
    return (
      <VirtualTable
        emptyRowsNodeGetter={ this.emptyRowsNodeGetter }
        store={ TransferStore }
        moduleId={ UI.Modules.TRANSFERS }
      >
        <Column
          name="User"
          width={150}
          flexGrow={4}
          columnKey="user"
          cell={ <UserCell/> }
        />
        <Column
          name="Name"
          width={150}
          flexGrow={4}
          columnKey="name"
          cell={ <NameCell/> }
        />
        <Column
          name="Segment"
          width={65}
          columnKey="size"
          cell={ <SizeCell/> }
          renderCondition={ this.isPositive }
          flexGrow={1}
        />
        <Column
          name="Status"
          width={140}
          flexGrow={4}
          columnKey="status"
          cell={ <StatusCell/> }
        />
        <Column
          name="Time left"
          width={50}
          columnKey="seconds_left"
          renderCondition={ this.isRunning }
          cell={ <AbbreviatedDurationCell/> }
        />
        <Column
          name="Speed"
          width={50}
          columnKey="speed"
          cell={ <SpeedCell/> }
          renderCondition={ this.isRunning }
          flexGrow={1}
        />
        <Column
          name="Flags"
          width={50}
          columnKey="flags"
          cell={ <FlagsCell/> }
          renderCondition={ this.isRunning }
          flexGrow={1}
          hideWidth={800}
        />
        <Column
          name="IP"
          width={120}
          columnKey="ip"
          flexGrow={1}
          cell={ <IpCell/> }
          hideWidth={1000}
        />
      </VirtualTable>
    );
  }
}

export default withTranslation()(Transfers);