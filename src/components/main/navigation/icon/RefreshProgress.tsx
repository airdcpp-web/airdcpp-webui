import { memo } from 'react';

import Icon from 'components/semantic/Icon';

import IconConstants from 'constants/IconConstants';
import ShareConstants from 'constants/ShareConstants';

import DataProviderDecorator from 'decorators/DataProviderDecorator';

import * as API from 'types/api';

interface RefreshProgressProps {}

interface RefreshProgressDataProps {
  tasks: API.ShareRefreshTask[];
}

const RefreshProgress = memo<RefreshProgressProps & RefreshProgressDataProps>(
  function RefreshProgress({ tasks }) {
    if (!tasks.length || tasks.every((t) => t.canceled)) {
      return null;
    }

    // TODO: add progress?
    return (
      <Icon
        icon={IconConstants.REFRESH_COLORED}
        className="loading"
        size="large"
        style={{
          margin: '5px 0px',
        }}
      />
    );
  },
);

export default DataProviderDecorator<RefreshProgressProps, RefreshProgressDataProps>(
  RefreshProgress,
  {
    urls: {
      tasks: ShareConstants.REFRESH_TASKS_URL,
    },
    onSocketConnected: (addSocketListener, { refetchData }) => {
      const refetchInstalled = () => refetchData(['tasks']);

      addSocketListener(
        ShareConstants.MODULE_URL,
        ShareConstants.REFRESH_STARTED,
        refetchInstalled,
      );
      addSocketListener(
        ShareConstants.MODULE_URL,
        ShareConstants.REFRESH_COMPLETED,
        refetchInstalled,
      );
    },
  },
);
