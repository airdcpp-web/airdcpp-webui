const FieldTypes = require('constants/SettingConstants').FieldTypes;

module.exports = {
  typeId: 'rss',
  component: require('./components/RSS').default,
  name: 'RSS feed',
  icon: 'orange rss',
  formSettings: [
    {
      key: 'feed_url',
      title: 'Feed URL',
      type: FieldTypes.STRING,
      help: 'RSS and Atom feeds are supported',
    },
    {
      key: 'feed_cache_minutes',
      title: 'Minimum refetch interval (minutes)',
      type: FieldTypes.NUMBER,
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

