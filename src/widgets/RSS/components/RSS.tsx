import PropTypes from 'prop-types';
import React from 'react';

import Loader from 'components/semantic/Loader';
import Message from 'components/semantic/Message';

import { loadSessionProperty, saveSessionProperty } from 'utils/BrowserUtils';

import Entry, { FeedItem } from 'widgets/RSS/components/Entry';
import Footer from 'widgets/RSS/components/Footer';
import { Settings } from 'widgets/RSS';

import '../style.css';
import invariant from 'invariant';


const getEntryKey = (entry: FeedItem): string => {
  if (!!entry.guid) {
    if (typeof entry.guid === 'object') {
      if (!!entry.guid.content) {
        return entry.guid.content;
      }
    } else {
      return entry.guid;
    }
  }

  if (!!entry.id) {
    if (typeof entry.id === 'object') {
      if (!!entry.id.content) {
        return entry.id.content;
      }
    } else {
      return entry.id;
    }
  }

  return 'DUMMY';
};


const idToCacheKey = (id: string) => 'rss_feed_cache_' + id;


export interface Feed {
  results?: {
    error?: { description: string; };
    rss?: {
      channel?: {
        item?: FeedItem[];
      }
    };
    feed?: {
      entry?: FeedItem[];
    }
  }
}

export type RSSProps = UI.WidgetProps<Settings>;

interface State {
  entries?: FeedItem[] | null;
  date?: number;
  error: string | null;
}

class RSS extends React.PureComponent<RSSProps, State> {
  static propTypes = {
    /**
		 * Current widget settings
		 */
    settings: PropTypes.object.isRequired,

    componentId: PropTypes.string.isRequired,
  };

  constructor(props: RSSProps, context: any) {
    super(props, context);
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
  };

  fetchFeed = (feedUrl: string) => {
    invariant(!!feedUrl, 'Feed URL missing');
    if (this.state.entries) {
      this.setState({ entries: null });
    }

    $.getJSON(
      `https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20xml%20where%20url%20%3D%20\'${encodeURIComponent(feedUrl)}\'&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback=`, 
      res => {
        console.log('RSS feed received', res);
        this.onFeedFetched(res.query);
      }
    );
  };

  UNSAFE_componentWillReceiveProps(nextProps: RSSProps) {
    if (nextProps.settings.feed_url !== this.props.settings.feed_url) {
      this.fetchFeed(nextProps.settings.feed_url);
    }
  }

  getCachedFeedInfo = () => {
    const feedInfo = loadSessionProperty(idToCacheKey(this.props.componentId));
    if (feedInfo) {
      const feedDate = new Date(feedInfo.date).getTime();
      const lastValidDate = feedDate + (this.props.settings.feed_cache_minutes * 60 * 1000);

      if (lastValidDate >= Date.now()) {
        console.log('RSS: cached feed will be used (expires in ' + (lastValidDate - Date.now()) / 60 / 1000 + ' minutes)');
        return feedInfo;
      } else {
        console.log('RSS: cached feed had expired ' + (Date.now() - lastValidDate) / 60 / 1000 + ' minutes ago');
      }
    } else {
      console.log('RSS: no cached feed');
    }

    return null;
  };

  setError = (error: string) => {
    this.setState({
      error
    });
  };

  onFeedFetched = (data: Feed) => {
    if (!data.results) {
      this.setError('The URL is invalid, the feed is empty or there is a temporary issue with the feed service');
      return;
    }

    if (data.results.error) {
      this.setError(data.results.error.description);
      return;
    }

    let entries = [];
    if (data.results.rss) {
      if (!data.results.rss.channel || !data.results.rss.channel.item) {
        this.setError('Invalid/unsupported feed (no channel/item)');
        return;
      }

      entries = data.results.rss.channel.item;
    } else if (data.results.feed) {
      if (!data.results.feed.entry) {
        this.setError('Invalid/unsupported feed (no feed entry)');
        return;
      }

      entries = data.results.feed.entry;
    } else {
      this.setError('No "rss" or "feed" tag was found');
      return;
    }

    if (!Array.isArray(entries)) {
      if (typeof entries !== 'object') {
        this.setError('Invalid/unsupported feed (entries is not an array or an object)');
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
  };

  render() {
    const { error, entries } = this.state;
    if (!!error) {
      return (
        <Message
          description={ error }
        />
      );
    }

    if (!entries) {
      return <Loader text="Loading feed" inline={true}/>;
    }

    const { settings, componentId } = this.props;
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
			  			/>
			  		))
				  }
        </div>
        <Footer
          lastUpdated={ this.state.date }
          handleUpdate={ this.handleUpdate }
        />
      </div>
    );
  }
}

export default RSS;