import React from 'react';

import RedrawDecorator from 'decorators/RedrawDecorator';
import ShareActions from 'actions/ShareActions';
import { formatRelativeTime } from 'utils/ValueFormat';
import Loader from 'components/semantic/Loader';
import { RowWrapperCellChildProps } from 'components/table/RowWrapperCell';

import * as API from 'types/api';


const RefreshCell: React.SFC<RowWrapperCellChildProps<number, API.ShareRootEntry>> = (
  { rowDataGetter, cellData }
) => {
  const state = rowDataGetter!().status;
  if (state.id !== API.ShareRootStatusEnum.NORMAL) {
    return <Loader size="small" inline={ true } text={ state.str }/>;
  }

  return (
    <div>
      <i 
        className={ 'icon large link green refresh' } 
        onClick={ () => ShareActions.refreshPaths([ rowDataGetter!().path ]) }
      />
      { cellData === 0 ? 'Unknown' : formatRelativeTime(cellData!) }
    </div>
  );
};

export default RedrawDecorator(RefreshCell);