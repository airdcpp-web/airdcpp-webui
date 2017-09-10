import React from 'react';

import FormattedFile from 'components/format/FormattedFile';
import Popup from 'components/semantic/Popup';


const NameCaption = ({ cellData, rowData }) => (
  <Popup 
    triggerClassName="name" 
    className="basic target" 
    trigger={ cellData }
  >
    <div>{ rowData.target }</div>
  </Popup>
);

class NameCell extends React.Component {
  shouldComponentUpdate(nextProps, nextState) {
    return nextProps.cellData !== this.props.cellData;
  }

  render() {
    const { cellData, rowDataGetter } = this.props;
    if (!cellData) {
      return null;
    }

    const rowData = rowDataGetter();
    return (
      <FormattedFile 
        typeInfo={ rowData.type }
        caption={ <NameCaption cellData={ cellData } rowData={ rowData }/> }
      />
    );
  }
}

export default NameCell;