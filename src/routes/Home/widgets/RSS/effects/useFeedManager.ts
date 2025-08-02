import { useEffect, useState } from 'react';

import { loadSessionProperty, saveSessionProperty } from '@/utils/BrowserUtils';

import { Settings } from '../';
import { FeedItem, RawFeedData } from '../types';
import { fetchRSSFeed, parseRSSFeed } from '../utils';

import * as UI from '@/types/ui';

import { useSession } from '@/context/AppStoreContext';
import { UILogger, useLogger } from '@/effects/LoggerEffect';

import '../style.css';

const idToCacheKey = (id: string) => `rss_feed_cache_${id}`;

interface StorageFeed {
  entries: FeedItem[];
  date: number;
}

const getCachedFeedInfo = (componentId: string, settings: Settings, logger: UILogger) => {
  const feedInfo = loadSessionProperty<StorageFeed>(idToCacheKey(componentId));

  const { feed_url, feed_cache_minutes } = settings;
  if (feedInfo) {
    const feedDate = new Date(feedInfo.date).getTime();
    const lastValidDate = feedDate + feed_cache_minutes * 60 * 1000;

    if (lastValidDate >= Date.now()) {
      logger.info(
        `RSS: cached feed will be used (expires in ${
          (lastValidDate - Date.now()) / 60 / 1000
        } minutes)`,
        feed_url,
      );

      return feedInfo;
    } else {
      logger.info(
        `RSS: cached feed had expired ${
          (Date.now() - lastValidDate) / 60 / 1000
        } minutes ago`,
        feed_url,
      );
    }
  } else {
    logger.info('RSS: no cached feed', feed_url);
  }

  return null;
};

export const useFeedManager = (props: UI.WidgetProps<Settings>) => {
  const { settings, widgetT, componentId } = props;
  const logger = useLogger();

  const session = useSession();

  const [feedInfo, setFeedInfo] = useState<StorageFeed | null>(
    getCachedFeedInfo(componentId, settings, logger),
  );
  const [error, setError] = useState<string | null>(null);

  const resetFeed = () => {
    if (feedInfo?.entries) {
      setFeedInfo(null);
    }

    if (error) {
      setError(null);
    }
  };

  const onFeedFetched = (data: RawFeedData) => {
    const entries = parseRSSFeed(data, widgetT);

    saveSessionProperty(idToCacheKey(componentId), {
      entries,
      date: Date.now(),
    });

    setFeedInfo({ entries, date: Date.now() });
  };

  const fetchFeed = async (feedUrl: string) => {
    if (!feedUrl.startsWith('http://') && !feedUrl.startsWith('https://')) {
      setError(widgetT.translate('Invalid URL'));
      return;
    }

    resetFeed();

    try {
      const jsonFeed = await fetchRSSFeed(feedUrl, session);
      logger.info('RSS feed received', feedUrl);
      onFeedFetched(jsonFeed);
    } catch (e) {
      logger.warn('RSS feed download failed', feedUrl, e);
      setError(e.message);
    }
  };

  const handleUpdate = () => {
    fetchFeed(settings.feed_url);
  };

  useEffect(() => {
    if (!feedInfo?.entries) {
      handleUpdate();
    }
  }, []);

  useEffect(() => {
    fetchFeed(settings.feed_url);
  }, [settings.feed_url]);

  return { error, feedInfo, handleUpdate };
};
