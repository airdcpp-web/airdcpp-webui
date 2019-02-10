import React from 'react';

import RedrawDecorator from 'decorators/RedrawDecorator';
import ShareActions from 'actions/ShareActions';
import { formatRelativeTime } from 'utils/ValueFormat';
import Loader from 'components/semantic/Loader';
import { RowWrapperCellChildProps } from 'components/table/RowWrapperCell';

import * as API from 'types/api';
import * as UI from 'types/ui';
import { translate } from 'utils/TranslationUtils';


interface RefreshCellProps extends RowWrapperCellChildProps<number, API.ShareRootEntry> {}

const RefreshCell: React.FC<RefreshCellProps> = (
  { rowDataGetter, cellData, t }
) => {
  const state = rowDataGetter!().status;
  if (state.id !== API.ShareRootStatusEnum.NORMAL) {
    return <Loader size="small" inline={ true } text={ state.str }/>;
  }

  return (
    <div>
      <i 
        className={ 'icon large link green refresh' } 
        onClick={ () => ShareActions.actions.refreshPaths([ rowDataGetter!().path ]) }
      />
      { cellData === 0 ? translate('Unknown', t!, UI.Modules.SHARE) : formatRelativeTime(cellData!) }
    </div>
  );
};

export default RedrawDecorator(RefreshCell);