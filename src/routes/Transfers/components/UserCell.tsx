import * as React from 'react';

import TransferActions from 'actions/ui/transfer/TransferActions';
import { UserFileActions } from 'actions/ui/user/UserActions';

import { TableActionMenu, TableUserMenu } from 'components/action-menu';
import IconConstants from 'constants/IconConstants';
import { RowWrapperCellChildProps } from 'components/table/RowWrapperCell';

import * as API from 'types/api';
import MenuConstants from 'constants/MenuConstants';
import classNames from 'classnames';

const UserCaption: React.FC<RowWrapperCellChildProps<API.HintedUser, API.Transfer>> = ({
  cellData,
  rowData,
}) => (
  <div className="transfer-user icon-caption">
    <i
      className={classNames(
        rowData!.download ? IconConstants.DOWNLOAD : IconConstants.UPLOAD,
        'large icon',
      )}
    />
    {cellData!.nicks}
  </div>
);

interface UserCellProps extends RowWrapperCellChildProps<API.HintedUser, API.Transfer> {}

class UserCell extends React.Component<UserCellProps> {
  shouldComponentUpdate(nextProps: UserCellProps) {
    return nextProps.cellData !== this.props.cellData;
  }

  render() {
    const { cellData, rowDataGetter } = this.props;
    return (
      <TableUserMenu
        user={cellData!}
        userIcon={null}
        ids={UserFileActions}
        text={<UserCaption rowData={rowDataGetter!()} cellData={cellData} />}
        remoteMenuId={MenuConstants.HINTED_USER}
      >
        <TableActionMenu
          itemData={rowDataGetter}
          actions={TransferActions}
          remoteMenuId={MenuConstants.TRANSFER}
        />
      </TableUserMenu>
    );
  }
}

export default UserCell;
