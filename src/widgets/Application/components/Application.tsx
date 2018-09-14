import React from 'react';

import StatisticsDecorator from 'decorators/StatisticsDecorator';

import WidgetDropdown from './WidgetDropdown';

import SystemConstants from 'constants/SystemConstants';

import { ListItem } from 'components/semantic/List';
import { formatRelativeTime } from 'utils/ValueFormat';

import LoginStore from 'stores/LoginStore';

import '../style.css';


const Statistics = StatisticsDecorator<any>(
  ({ stats }) => (
    <div className="ui list">
      <ListItem header="Logged in as" description={ LoginStore.user.username }/>
      <ListItem header="Client started" description={ formatRelativeTime(LoginStore.systemInfo.client_started) }/>
      <ListItem header="Active sessions" description={ stats.active_sessions }/>
    </div>
  ), 
  SystemConstants.STATS_URL, 
  'Failed to fetch information', 
  10
);


export interface ApplicationProps {
  componentId: string;
}

class Application extends React.PureComponent<ApplicationProps> {
  static propTypes = {

  };

  render() {
    return (
      <div className="application-container">
        <Statistics/>
        <WidgetDropdown
          componentId={ this.props.componentId }
        />
      </div>
    );
  }
}

export default Application;