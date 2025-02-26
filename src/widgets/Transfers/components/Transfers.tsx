import Loader from '@/components/semantic/Loader';
import StatColumn from './StatColumn';
import SpeedChart from './SpeedChart';

import useMeasure from 'react-use-measure';

import * as UI from '@/types/ui';

import {
  SocketSubscriptionDecoratorChildProps,
  SocketSubscriptionDecorator,
} from '@/decorators/SocketSubscriptionDecorator';
import { useTransferStats } from '../effects/useTransferStats';

import '../style.css';
interface TransferWidgetSettings {
  maxEvents?: number;
}

interface TransferProps extends UI.WidgetProps<TransferWidgetSettings> {}

const Transfers: React.FC<TransferProps & SocketSubscriptionDecoratorChildProps> = ({
  settings,
  socket,
  addSocketListener,
  widgetT,
}) => {
  const [measureRef, bounds] = useMeasure({
    debounce: 100,
  });

  const { stats, series } = useTransferStats(
    socket,
    addSocketListener,
    settings.maxEvents,
  );
  if (!stats) {
    return <Loader inline={true} />;
  }

  /*console.error(
    'Transfer widget bounds',
    JSON.stringify(bounds, null, 2),
    JSON.stringify(settings, null, 2),
  );*/

  const { points, maxDownload, maxUpload } = series;
  return (
    <div ref={measureRef} className="transfers-container">
      <SpeedChart
        trafficSeries={points}
        maxDownload={maxDownload}
        maxUpload={maxUpload}
        widgetT={widgetT}
      />
      {bounds.width >= 300 && <StatColumn stats={stats} widgetT={widgetT} />}
      <div data-testid="transfer-widget-event-count" style={{ display: 'none' }}>
        {points.length}
      </div>
    </div>
  );
};

export default SocketSubscriptionDecorator<TransferProps>(Transfers);
