import React from 'react';

import RedrawDecorator from 'decorators/RedrawDecorator';
import ShareActions from 'actions/ShareActions';
import { StateEnum } from 'constants/ShareRootConstants';
import { formatRelativeTime } from 'utils/ValueFormat';
import Loader from 'components/semantic/Loader';


const RefreshCell = ({ rowDataGetter, cellData }) => {
  const state = rowDataGetter().status;
  if (state.id !== StateEnum.NORMAL) {
    return <Loader size="small" inline={ true } text={ state.str }/>;
  }

  return (
    <div>
      <i className={ 'icon large link green refresh' } onClick={ () => ShareActions.refreshPaths([ rowDataGetter().path ]) }/>
      { cellData === 0 ? 'Unknown' : formatRelativeTime(cellData) }
    </div>
  );
};

export default RedrawDecorator(RefreshCell);