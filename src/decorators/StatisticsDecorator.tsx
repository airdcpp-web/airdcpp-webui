import * as React from 'react';

import Message from 'components/semantic/Message';
import { ErrorResponse } from 'airdcpp-apisocket';

import { Translation } from 'react-i18next';
import { translate } from 'utils/TranslationUtils';

import * as UI from 'types/ui';
import { useSocket } from 'context/SocketContext';

export interface StatisticsDecoratorProps<DataT> {}

export interface StatisticsDecoratorChildProps<DataT> {
  stats: DataT;
}

// Decorator for statistics pages that fetch the content from API
const StatisticsDecorator = function <DataT extends object, PropsT>(
  Component: React.ComponentType<StatisticsDecoratorChildProps<DataT> & PropsT>,
  fetchUrl: string,
  unavailableMessage: ((t: UI.TranslateF, props: PropsT) => string) | null,
  fetchIntervalSeconds = 0,
) {
  const Decorator: React.FC<StatisticsDecoratorProps<DataT> & PropsT> = (props) => {
    const [stats, setStats] = React.useState<DataT | null | undefined>(null);

    const socket = useSocket();

    const onStatsReceived = (data: DataT) => {
      setStats(data);
    };

    const fetchStats = () => {
      socket
        .get<DataT | undefined>(fetchUrl)
        .then(onStatsReceived)
        .catch((error: ErrorResponse) =>
          console.error('Failed to fetch stats', error.message),
        );
    };

    React.useEffect(() => {
      fetchStats();

      const fetchInterval = window.setInterval(fetchStats, fetchIntervalSeconds * 1000);
      return () => {
        window.clearTimeout(fetchInterval);
      };
    }, []);

    if (stats === null) {
      return null;
    }

    // The returned stats can be undefined if the daemon has no data to generate them
    // (e.g. no hub stats if there are no connected hubs)
    if (stats === undefined) {
      return (
        <Translation>
          {(t) => (
            <Message
              title={translate('Statistics not available', t, UI.Modules.COMMON)}
              description={!unavailableMessage ? undefined : unavailableMessage(t, props)}
            />
          )}
        </Translation>
      );
    }

    return <Component {...props} stats={stats} />;
  };

  return Decorator;
};

export default StatisticsDecorator;
