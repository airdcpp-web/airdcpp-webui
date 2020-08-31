import PropTypes from 'prop-types';
import React from 'react';
import { parse as parseXML } from 'fast-xml-parser';
import { decode } from 'he';

import Loader from 'components/semantic/Loader';
import Message from 'components/semantic/Message';

import { loadSessionProperty, saveSessionProperty } from 'utils/BrowserUtils';
import { fetchCorsSafeData } from 'services/HttpService';

import Entry from 'widgets/RSS/components/Entry';
import Footer from 'widgets/RSS/components/Footer';
import { Settings } from 'widgets/RSS';

import '../style.css';

import * as UI from 'types/ui';

import { FeedItem, parseNodeContent } from '../types';


const getEntryKey = (entry: FeedItem): string => {
  if (!!entry.guid) {
    return parseNodeContent(entry.guid);
  }

  if (!!entry.id) {
    return parseNodeContent(entry.id);
  }

  return 'DUMMY';
};


const idToCacheKey = (id: string) => 'rss_feed_cache_' + id;


export interface Feed {
  rss?: {
    channel?: {
      item?: FeedItem[];
    }
  };
  feed?: {
    entry?: FeedItem[];
  };
}

export type RSSProps = UI.WidgetProps<Settings>;


interface StorageFeed {
  entries: FeedItem[] | null;
  date: number;
}
interface State extends Partial<StorageFeed> {
  error: string | null;
}

class RSS extends React.PureComponent<RSSProps, State> {
  static propTypes = {
    // Current widget settings
    settings: PropTypes.object.isRequired,

    componentId: PropTypes.string.isRequired,
  };

  constructor(props: RSSProps) {
    super(props);
    const feedInfo = this.getCachedFeedInfo();

    this.state = {
      error: null,
      ...feedInfo,
    };
  }

  componentDidMount() {
    if (!this.state.entries) {
      this.handleUpdate();
    }
  }

  handleUpdate = () => {
    this.fetchFeed(this.props.settings.feed_url);
  }

  fetchFeed = async (feedUrl: string) => {
    const { widgetT } = this.props;
    if (!feedUrl.startsWith('http://') && !feedUrl.startsWith('https://')) {
      this.setError(widgetT.translate('Invalid URL'));
      return;
    }


    if (this.state.entries) {
      this.setState({ entries: null });
    }

    try {
      const data = await fetchCorsSafeData(feedUrl, false);

      console.log('RSS feed received', feedUrl);

      const jsonFeed = parseXML(data, {
        attrNodeName: 'attr',
        textNodeName : 'text',
        parseAttributeValue : true,
        ignoreAttributes : false,
        attributeNamePrefix: '',
        attrValueProcessor: a => decode(a, { isAttributeValue: true }),
        tagValueProcessor : a => decode(a),
      });

      this.onFeedFetched(jsonFeed);
    } catch (e) {
      console.log('RSS feed download failed', feedUrl, e);
      this.setError(e.message);
    }
  }

  componentDidUpdate(prevProps: RSSProps) {
    if (prevProps.settings.feed_url !== this.props.settings.feed_url) {
      this.fetchFeed(this.props.settings.feed_url);
    }
  }

  getCachedFeedInfo = (): StorageFeed | null => {
    const feedInfo = loadSessionProperty<StorageFeed>(idToCacheKey(this.props.componentId));
    const { feed_url, feed_cache_minutes } = this.props.settings;
    if (feedInfo) {
      const feedDate = new Date(feedInfo.date).getTime();
      const lastValidDate = feedDate + (feed_cache_minutes * 60 * 1000);

      if (lastValidDate >= Date.now()) {
        console.log(
          `RSS: cached feed will be used (expires in ${(lastValidDate - Date.now()) / 60 / 1000} minutes)`, 
          feed_url
        );

        return feedInfo;
      } else {
        console.log(`RSS: cached feed had expired ${(Date.now() - lastValidDate) / 60 / 1000} minutes ago`, feed_url);
      }
    } else {
      console.log('RSS: no cached feed', feed_url);
    }

    return null;
  }

  setError = (error: string) => {
    this.setState({
      error
    });
  }

  onFeedFetched = (data: Feed) => {
    let entries = [];

    const invalidFeed = (error: string) => {
      const { widgetT } = this.props;
      console.log(`Invalid feed: ${error}`);
      this.setError(widgetT.t('invalidFeed', { error }/*'Invalid/unsupported feed'*/));
    };

    const { rss, feed } = data;
    if (rss) {
      if (!rss.channel || !rss.channel.item) {
        invalidFeed('No channel/item');
        return;
      }

      entries = rss.channel.item;
    } else if (feed) {
      if (!feed.entry) {
        invalidFeed('No feed entry');
        return;
      }

      entries = feed.entry;
    } else {
      invalidFeed('No "rss" or "feed" tag was found');
      return;
    }

    if (!Array.isArray(entries)) {
      if (typeof entries !== 'object') {
        invalidFeed('Entries is not an array or an object');
        return;
      }

      // Single entry, convert to an array
      entries = [ entries ];
    }

    saveSessionProperty(idToCacheKey(this.props.componentId), {
      entries,
      date: Date.now(),
    });

    this.setState({
      error: null,
      entries,
      date: Date.now(),
    });
  }

  render() {
    const { error, entries, date } = this.state;
    if (!!error) {
      return (
        <Message
          description={ error }
        />
      );
    }

    const { settings, componentId, widgetT } = this.props;
    if (!entries) {
      return <Loader text={ widgetT.translate('Loading feed') } inline={true}/>;
    }

    return (
      <div className="rss-container">
        <div className="ui divided list rss">
          { 
            entries.map(entry => (
              <Entry 
                key={ getEntryKey(entry) } 
                entry={ entry }
                componentId={ componentId }
                feedUrl={ settings.feed_url }
                widgetT={ widgetT }
              />
            ))
          }
        </div>
        <Footer
          lastUpdated={ date }
          handleUpdate={ this.handleUpdate }
          widgetT={ widgetT }
        />
      </div>
    );
  }
}

export default RSS;