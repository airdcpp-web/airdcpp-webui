import * as React from 'react';

import {
  formatAverage,
  formatConnection,
  formatPercentage,
  useFormatter,
} from 'utils/ValueFormat';

import HubConstants from 'constants/HubConstants';

import StatisticsDecorator, {
  StatisticsDecoratorChildProps,
} from 'decorators/StatisticsDecorator';

import { Grid, Row, Header } from 'components/semantic/Grid';

//import * as UI from 'types/ui';
import { SettingPageProps } from 'routes/Settings/types';

interface HubStatisticsPageProps extends SettingPageProps {}

interface ClientInfo {
  name: string;
  count: number;
}

const formatClientRow = (uniqueUsers: number, client: ClientInfo) => {
  return (
    <Row
      key={client.name}
      title={client.name}
      text={`${client.count} (${formatPercentage(client.count, uniqueUsers)})`}
    />
  );
};

const HubStatisticsPage: React.FC<
  HubStatisticsPageProps & StatisticsDecoratorChildProps<any>
> = ({ stats, moduleT }) => {
  const { formatSize } = useFormatter();
  const { translate } = moduleT;
  return (
    <Grid columns="two" stackable={true}>
      <Row title={translate('Total users')} text={stats.total_users} />
      <Row
        title={translate('Unique users')}
        text={`${stats.unique_users} (${formatPercentage(
          stats.unique_users,
          stats.total_users,
        )})`}
      />
      <Row
        title={translate('Active users')}
        text={`${stats.active_users} (${formatPercentage(
          stats.active_users,
          stats.unique_users,
        )})`}
      />
      <Row title={translate('Total share')} text={formatSize(stats.total_share)} />
      <Row
        title={translate('Average share per user')}
        text={formatSize(
          formatAverage(stats.total_share, stats.unique_users) as any as number,
        )}
      />
      <Row
        title={translate('Average ADC download speed')}
        text={formatConnection(stats.adc_down_per_user, moduleT.plainT)}
      />
      <Row
        title={translate('Average ADC upload speed')}
        text={formatConnection(stats.adc_up_per_user, moduleT.plainT)}
      />
      <Header title={translate('Clients')} />
      {stats.clients.map((c: ClientInfo) => formatClientRow(stats.unique_users, c))}
    </Grid>
  );
};

export default StatisticsDecorator(
  HubStatisticsPage,
  HubConstants.STATS_URL,
  (t, props) => props.moduleT.translate('No hubs online'),
  10,
);
