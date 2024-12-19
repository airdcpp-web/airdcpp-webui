import * as React from 'react';
import DataProviderDecorator, {
  DataProviderDecoratorChildProps,
} from 'decorators/DataProviderDecorator';

import Checkbox from 'components/semantic/Checkbox';
import Button from 'components/semantic/Button';
import Message from 'components/semantic/Message';

import HashConstants from 'constants/HashConstants';
import LoginStore from 'stores/LoginStore';

import { formatSize } from 'utils/ValueFormat';

import '../style.css';

import * as API from 'types/api';
import * as UI from 'types/ui';

import { Trans } from 'react-i18next';
import { runBackgroundSocketAction } from 'utils/ActionUtils';
import { Row, Grid } from 'components/semantic/Grid';
import IconConstants from 'constants/IconConstants';
import { useSocket } from 'context/SocketContext';

interface OptimizeLayoutProps {
  running: boolean;
  startHandler: (verify: boolean) => void;
  moduleT: UI.ModuleTranslator;
}

const OptimizeLayout: React.FC<OptimizeLayoutProps> = ({
  startHandler,
  running,
  moduleT,
}) => {
  const { toI18nKey, translate } = moduleT;
  const [verify, setVerify] = React.useState(false);
  return (
    <div className="optimize-layout">
      <h4 className="header" style={{ marginTop: '30px' }}>
        {translate('Maintenance')}
      </h4>
      <Message
        description={
          <Trans i18nKey={toI18nKey('hashDBOptimizeNote')}>
            This operation will delete all hash information for files that aren't
            currently in share. If you are sharing files from network disks or from a
            removable storage, make sure that the files are currently shown in share
            (otherwise they have to be rehashed)
          </Trans>
        }
        icon={IconConstants.NOTE}
      />

      <Checkbox
        caption={translate('Verify integrity of hash data')}
        checked={verify}
        disabled={running}
        onChange={setVerify}
        floating={true}
      />
      <Button
        className="optimize-button"
        caption={translate('Optimize now')}
        icon={IconConstants.CONFIGURE}
        loading={running}
        onClick={() => startHandler(verify)}
      />
    </div>
  );
};

interface HashDatabaseLayoutProps {
  moduleT: UI.ModuleTranslator;
}
interface HashDatabaseLayoutDataProps extends DataProviderDecoratorChildProps {
  status: API.HashDatabaseStatus;
}

const HashDatabaseLayout: React.FC<
  HashDatabaseLayoutProps & HashDatabaseLayoutDataProps
> = ({ status, moduleT }) => {
  const socket = useSocket();
  const handleOptimize = (verify: boolean) => {
    runBackgroundSocketAction(
      () => socket.post(HashConstants.OPTIMIZE_DATABASE_URL, { verify }),
      moduleT.plainT,
    );
  };

  const { translate, plainT } = moduleT;
  return (
    <div className="ui segment hash-database">
      <h3 className="header">{translate('Hash database')}</h3>
      <Grid columns="two">
        <Row
          title={translate('File index size')}
          text={formatSize(status.file_index_size, plainT)}
          titleWidth="five"
        />
        <Row
          title={translate('Hash store size')}
          text={formatSize(status.hash_store_size, plainT)}
          titleWidth="five"
        />
      </Grid>
      {LoginStore.hasAccess(API.AccessEnum.SETTINGS_EDIT) && (
        <OptimizeLayout
          running={status.maintenance_running}
          startHandler={handleOptimize}
          moduleT={moduleT}
        />
      )}
    </div>
  );
};

export default DataProviderDecorator<
  HashDatabaseLayoutProps,
  HashDatabaseLayoutDataProps
>(HashDatabaseLayout, {
  urls: {
    status: HashConstants.DATABASE_STATUS_URL,
  },
  onSocketConnected: (addSocketListener, { refetchData }) => {
    addSocketListener(HashConstants.MODULE_URL, HashConstants.DATABASE_STATUS, () =>
      refetchData(),
    );
  },
});
