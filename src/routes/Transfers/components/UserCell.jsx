import React from 'react';

import TransferActions from 'actions/TransferActions';
import { UserFileActions } from 'actions/UserActions';

import { TableActionMenu, TableUserMenu } from 'components/menu/DropdownMenu';
import IconConstants from 'constants/IconConstants';


const UserCaption = ({ cellData, rowData }) => (
  <div className="transfer-user">
    <i className={ (rowData.download ? IconConstants.DOWNLOAD : IconConstants.UPLOAD) + ' large icon' }/>
    { cellData.nicks }
  </div>
);

class UserCell extends React.Component {
  shouldComponentUpdate(nextProps, nextState) {
    return nextProps.cellData !== this.props.cellData;
  }

  render() {
    const { cellData, rowDataGetter } = this.props;
    return (
      <TableUserMenu 
        user={ cellData }
        userIcon={ null }
        ids={ UserFileActions }
        text={ <UserCaption rowData={ rowDataGetter() } cellData={ cellData }/> }
      >
        <TableActionMenu 
          itemDataGetter={ rowDataGetter }
          actions={ TransferActions } 
        />
      </TableUserMenu>
    );
  }
}

export default UserCell;