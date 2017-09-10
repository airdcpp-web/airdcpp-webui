import { default as WidgetStore } from 'stores/WidgetStore';

import RSS from 'widgets/RSS';
import WidgetUtils from 'utils/WidgetUtils';


const countWidgetIds = (id, layouts) => {
  return Object.keys(layouts).reduce((sum, key) => {

    if (layouts[key].find(layoutItem => layoutItem.i === id)) {
      return sum + 1;
    }

    return sum;
  }, 0);
};

const hasLayoutItems = (id) => {
  return countWidgetIds(id, WidgetStore.layouts) === Object.keys(WidgetStore.cols).length;
};


describe('widget store', () => {
  test('should initialize default widgets', () => {
    expect(WidgetStore.widgets.length).toEqual(3);

    expect(hasLayoutItems('application_default')).toEqual(true);
    expect(hasLayoutItems('transfers_default')).toEqual(true);
    expect(hasLayoutItems('rss_releases')).toEqual(true);

    expect(hasLayoutItems('dummy')).toEqual(false);

    const settings = WidgetStore.getWidgetSettings('rss_releases', RSS);
    expect(settings).toEqual({
      name: 'News',
      widget: {
        feed_url: 'https://airdcpp-web.github.io/feed.xml',
        feed_cache_minutes: 60,
      }
    });
  });


  const widgetId = WidgetUtils.createId(RSS);
  const settings = {
    name: 'RSS feed',
    widget: {
      feed_url: 'http://test.com',
      feed_cache_minutes: 60,
    }
  };

  test('should handle widget actions', () => {
    WidgetStore.onCreateSaved(widgetId, settings, RSS);
    expect(hasLayoutItems(widgetId)).toEqual(true);
    expect(WidgetStore.getWidgetSettings(widgetId)).toEqual(settings);

    WidgetStore.onRemoveConfirmed(widgetId);
    expect(countWidgetIds(widgetId, WidgetStore.layouts)).toEqual(0);
    expect(WidgetStore.getWidgetSettings(widgetId)).toEqual({});
  });
});