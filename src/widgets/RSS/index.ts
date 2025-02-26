import * as API from '@/types/api';
import * as UI from '@/types/ui';

import RSS from './components/RSS';

export const RSSWidgetInfo = {
  typeId: 'rss',
  component: RSS,
  name: 'RSS feed',
  nameKey: 'rssFeed',
  icon: 'orange rss',
  formSettings: [
    {
      key: 'feed_url',
      title: 'Feed URL',
      type: API.SettingTypeEnum.URL,
      help: 'RSS and Atom feeds are supported',
      default_value: '',
    },
    {
      key: 'feed_cache_minutes',
      title: 'Minimum refetch interval (minutes)',
      type: API.SettingTypeEnum.NUMBER,
      default_value: 60,
    },
  ],
  size: {
    w: 3,
    h: 5,
    minW: 2,
    minH: 3,
  },
} as UI.Widget;

export interface Settings {
  feed_url: string;
  feed_cache_minutes: number;
}
