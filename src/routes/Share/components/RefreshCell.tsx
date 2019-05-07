import React from 'react';

import RedrawDecorator from 'decorators/RedrawDecorator';
import { formatRelativeTime } from 'utils/ValueFormat';
import Loader from 'components/semantic/Loader';
import { RowWrapperCellChildProps } from 'components/table/RowWrapperCell';

import * as API from 'types/api';
import * as UI from 'types/ui';

import { translate } from 'utils/TranslationUtils';
import { refreshPaths } from 'services/api/ShareApi';
import { runBackgroundSocketAction } from 'utils/ActionUtils';
import Icon from 'components/semantic/Icon';
import IconConstants from 'constants/IconConstants';


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
      <Icon
        icon={ IconConstants.REFRESH_COLORED }
        size="large"
        onClick={ () => 
          runBackgroundSocketAction(
            () => refreshPaths([ rowDataGetter!().path ]),
            t!
          )
        }
      />
      { cellData === 0 ? translate('Unknown', t!, UI.Modules.SHARE) : formatRelativeTime(cellData!) }
    </div>
  );
};

export default RedrawDecorator(RefreshCell);