import * as React from 'react';

import RedrawDecorator from '@/decorators/RedrawDecorator';
import { useFormatter } from '@/context/FormatterContext';
import Loader from '@/components/semantic/Loader';
import { RowWrapperCellChildProps } from '@/components/table/RowWrapperCell';

import * as API from '@/types/api';
import * as UI from '@/types/ui';

import { translate } from '@/utils/TranslationUtils';
import { abortRefreshTask, refreshPaths } from '@/services/api/ShareApi';
import { runBackgroundSocketAction } from '@/utils/ActionUtils';
import Icon from '@/components/semantic/Icon';
import IconConstants from '@/constants/IconConstants';
import { useSocket } from '@/context/SocketContext';

interface RefreshCellProps extends RowWrapperCellChildProps<number, API.ShareRootEntry> {}

const RefreshCell: React.FC<RefreshCellProps> = ({ rowDataGetter, cellData, t }) => {
  const { formatRelativeTime } = useFormatter();
  const state = rowDataGetter!().status;
  const socket = useSocket();
  if (state.id !== API.ShareRootStatusEnum.NORMAL) {
    return (
      <div style={{ display: 'flex' }}>
        <Icon
          icon={IconConstants.CANCEL}
          color="red"
          size="large"
          onClick={() => {
            const refreshTaskId = rowDataGetter!().status.refresh_task_id;
            if (!!refreshTaskId) {
              runBackgroundSocketAction(
                () => abortRefreshTask(refreshTaskId, socket),
                t!,
              );
            }
          }}
        />
        <Loader size="small" inline={true} text={state.str} />
      </div>
    );
  }

  return (
    <div>
      <Icon
        icon={IconConstants.REFRESH_COLORED}
        size="large"
        onClick={() =>
          runBackgroundSocketAction(
            () => refreshPaths([rowDataGetter!().path], socket),
            t!,
          )
        }
      />
      {cellData === 0
        ? translate('Unknown', t!, UI.Modules.SHARE)
        : formatRelativeTime(cellData!)}
    </div>
  );
};

export default RedrawDecorator(RefreshCell);
