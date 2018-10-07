import React from 'react';

import TransferActions from 'actions/TransferActions';
import { UserFileActions } from 'actions/UserActions';

import { TableActionMenu, TableUserMenu } from 'components/menu';
import IconConstants from 'constants/IconConstants';
import { RowWrapperCellChildProps } from 'components/table/RowWrapperCell';

import * as API from 'types/api';


const UserCaption: React.SFC<RowWrapperCellChildProps<API.HintedUser, API.Transfer>> = ({ cellData, rowData }) => (
  <div className="transfer-user">
    <i className={ (rowData!.download ? IconConstants.DOWNLOAD : IconConstants.UPLOAD) + ' large icon' }/>
    { cellData!.nicks }
  </div>
);

interface UserCellProps extends RowWrapperCellChildProps<API.HintedUser, API.Transfer> {

}

class UserCell extends React.Component<UserCellProps> {
  shouldComponentUpdate(nextProps: UserCellProps) {
    return nextProps.cellData !== this.props.cellData;
  }

  render() {
    const { cellData, rowDataGetter } = this.props;
    return (
      <TableUserMenu 
        user={ cellData! }
        userIcon={ null }
        ids={ UserFileActions }
        text={ <UserCaption rowData={ rowDataGetter!() } cellData={ cellData }/> }
      >
        <TableActionMenu 
          itemData={ rowDataGetter }
          actions={ TransferActions } 
        />
      </TableUserMenu>
    );
  }
}

export default UserCell;