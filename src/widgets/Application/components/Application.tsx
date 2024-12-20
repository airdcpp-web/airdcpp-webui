import { PureComponent } from 'react';

import StatisticsDecorator from 'decorators/StatisticsDecorator';

import WidgetDropdown from './WidgetDropdown';

import SystemConstants from 'constants/SystemConstants';

import { ListItem } from 'components/semantic/List';
import { formatRelativeTime } from 'utils/ValueFormat';

import '../style.css';
import * as UI from 'types/ui';
import { useSession } from 'context/SessionContext';

type StatisticsProps = Pick<UI.WidgetProps, 'widgetT'>;

const Statistics = StatisticsDecorator<any, StatisticsProps>(
  ({ stats, widgetT }) => {
    const { systemInfo, user } = useSession();
    return (
      <div className="ui list">
        <ListItem
          header={widgetT.translate('Logged in as')}
          description={user.username}
        />
        <ListItem
          header={widgetT.translate('Client started')}
          description={formatRelativeTime(systemInfo.client_started)}
        />
        <ListItem
          header={widgetT.translate('Active sessions')}
          description={stats.active_sessions}
        />
      </div>
    );
  },
  SystemConstants.STATS_URL,
  null,
  10,
);

export type ApplicationProps = UI.WidgetProps;

class Application extends PureComponent<ApplicationProps> {
  render() {
    const { widgetT } = this.props;
    return (
      <div className="application-container">
        <Statistics widgetT={widgetT} />
        <WidgetDropdown componentId={this.props.componentId} widgetT={widgetT} />
      </div>
    );
  }
}

export default Application;
