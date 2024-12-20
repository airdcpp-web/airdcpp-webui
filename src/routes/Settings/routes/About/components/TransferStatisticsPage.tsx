import * as React from 'react';

import { useFormatter } from 'utils/ValueFormat';
import { Row, Header, Grid } from 'components/semantic/Grid';

import TransferConstants from 'constants/TransferConstants';
import StatisticsDecorator, {
  StatisticsDecoratorChildProps,
} from 'decorators/StatisticsDecorator';
import { SettingPageProps } from 'routes/Settings/types';

interface TransferStatisticsPageProps extends SettingPageProps {}

const TransferStatisticsPage: React.FC<
  TransferStatisticsPageProps & StatisticsDecoratorChildProps<any>
> = ({ stats, moduleT }) => {
  const { translate } = moduleT;
  const { formatSize } = useFormatter();

  const totalUp = stats.session_uploaded + stats.start_total_uploaded;
  const totalDown = stats.session_downloaded + stats.start_total_downloaded;

  return (
    <Grid columns="two" stackable={true}>
      <Row title={translate('Total downloaded')} text={formatSize(totalDown)} />
      <Row title={translate('Total uploaded')} text={formatSize(totalUp)} />
      <Header title={translate('Session')} />
      <Row
        title={translate('Session downloaded')}
        text={formatSize(stats.session_downloaded)}
      />
      <Row
        title={translate('Session uploaded')}
        text={formatSize(stats.session_uploaded)}
      />
    </Grid>
  );
};

export default StatisticsDecorator(
  TransferStatisticsPage,
  TransferConstants.TRANSFERRED_BYTES_URL,
  null,
  5,
);
