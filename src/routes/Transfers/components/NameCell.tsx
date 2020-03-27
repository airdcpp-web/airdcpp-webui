import React from 'react';

import FormattedFile from 'components/format/FormattedFile';
import Popup from 'components/semantic/Popup';
import { RowWrapperCellChildProps } from 'components/table/RowWrapperCell';

import * as API from 'types/api';


const NameCaption: React.FC<RowWrapperCellChildProps<string, API.Transfer>> = ({ cellData, rowData }) => (
  <Popup 
    triggerClassName="name" 
    className="basic target" 
    trigger={ cellData }
  >
    <div>{ rowData!.target }</div>
  </Popup>
);

interface NameCellProps extends RowWrapperCellChildProps<string, API.Transfer> {

}

class NameCell extends React.Component<NameCellProps> {
  shouldComponentUpdate(nextProps: NameCellProps) {
    return nextProps.cellData !== this.props.cellData;
  }

  render() {
    const { cellData, rowDataGetter } = this.props;
    if (!cellData) {
      return null;
    }

    const rowData = rowDataGetter!();
    if (!rowData.type) {
      return null;
    }

    return (
      <FormattedFile 
        typeInfo={ rowData.type }
        caption={ <NameCaption cellData={ cellData } rowData={ rowData }/> }
      />
    );
  }
}

export default NameCell;