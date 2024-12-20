import * as React from 'react';

import { Row, Header, Grid } from 'components/semantic/Grid';

import StatisticsDecorator, {
  StatisticsDecoratorChildProps,
} from 'decorators/StatisticsDecorator';
import SystemConstants from 'constants/SystemConstants';
import { formatDateTime, formatRelativeTime } from 'utils/ValueFormat';
import InstallPrompt from 'components/InstallPrompt';
import { SettingPageProps } from 'routes/Settings/types';
import LinkConstants from 'constants/LinkConstants';
import ExternalLink from 'components/ExternalLink';
import { useSession } from 'context/SessionContext';

interface ApplicationPageProps extends SettingPageProps {}

const ApplicationPage: React.FC<
  ApplicationPageProps & StatisticsDecoratorChildProps<any>
> = ({ stats, moduleT }) => {
  const { translate } = moduleT;
  const { systemInfo } = useSession();

  const buildDate = formatDateTime(UI_BUILD_DATE / 1000);
  return (
    <>
      <Grid columns="two" stackable={true}>
        <Row title={translate('Application version')} text={systemInfo.client_version} />
        <Row title={translate('Web UI version')} text={UI_VERSION} />
        <Row title={translate('Web UI build date')} text={buildDate} />
        <Row title={translate('API version')} text={systemInfo.api_version} />
        <Row title={translate('API feature level')} text={systemInfo.api_feature_level} />
        <Row
          title={translate('Started')}
          text={formatRelativeTime(systemInfo.client_started)}
        />
        <Row title={translate('Active sessions')} text={stats.active_sessions} />
        <Row title={translate('Server threads')} text={stats.server_threads} />

        <Header title={translate('Resources')} />
        <Row
          title={
            <ExternalLink url={LinkConstants.HOME_PAGE_URL}>
              {translate('Home page')}
            </ExternalLink>
          }
          noText={true}
        />
        <Row
          title={
            <ExternalLink url={LinkConstants.HELP_URL}>
              {translate('Documentation')}
            </ExternalLink>
          }
          noText={true}
        />
        <Row
          title={
            <ExternalLink url={LinkConstants.ISSUE_TRACKER_URL}>
              {translate('Feature request/bug tracker')}
            </ExternalLink>
          }
          noText={true}
        />
        <Header title={translate('Third-party credits')} />
        <Row
          title={
            <ExternalLink url={LinkConstants.DBIP_URL}>
              IP Geolocation by DB-IP
            </ExternalLink>
          }
          noText={true}
        />
      </Grid>
      <InstallPrompt alwaysShow={true} />
    </>
  );
};

export default StatisticsDecorator(ApplicationPage, SystemConstants.STATS_URL, null, 5);
