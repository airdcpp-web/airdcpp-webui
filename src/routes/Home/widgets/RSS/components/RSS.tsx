import Loader from '@/components/semantic/Loader';
import Message from '@/components/semantic/Message';

import Entry from './Entry';
import Footer from './Footer';
import { Settings } from '../';
import { getUniqueEntryKey } from '../utils';

import { useFeedManager } from '../effects/useFeedManager';

import * as UI from '@/types/ui';

import '../style.css';

export type RSSProps = UI.WidgetProps<Settings>;

const RSS: React.FC<RSSProps> = (props) => {
  const { settings, widgetT, componentId } = props;
  const { error, feedInfo, handleUpdate } = useFeedManager(props);

  if (!!error) {
    return <Message description={error} />;
  }

  if (!feedInfo) {
    return <Loader text={widgetT.translate('Loading feed')} inline={true} />;
  }

  const { entries, date } = feedInfo;
  return (
    <div className="rss-container">
      <div className="ui divided list rss">
        {entries.map((entry) => (
          <Entry
            key={getUniqueEntryKey(entry)}
            entry={entry}
            componentId={componentId}
            feedUrl={settings.feed_url}
            widgetT={widgetT}
          />
        ))}
      </div>
      <Footer lastUpdated={date} handleUpdate={handleUpdate} widgetT={widgetT} />
    </div>
  );
};

export default RSS;
