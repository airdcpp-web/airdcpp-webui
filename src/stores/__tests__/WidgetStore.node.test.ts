import { default as WidgetStore, EmptyWidgetSettings } from '@/stores/reflux/WidgetStore';

import { RSSWidgetInfo } from '@/widgets/RSS';

import { Layouts, Layout } from 'react-grid-layout';
import { createWidgetId } from '@/utils/WidgetUtils';
import { describe, expect, test } from 'vitest';

const countWidgetIds = (id: string, layouts: Layouts) => {
  return Object.keys(layouts).reduce((sum, key) => {
    if (layouts[key].find((layoutItem: Layout) => layoutItem.i === id)) {
      return sum + 1;
    }

    return sum;
  }, 0);
};

const hasLayoutItems = (id: string) => {
  return countWidgetIds(id, WidgetStore.layouts) === Object.keys(WidgetStore.cols).length;
};

describe('widget store', () => {
  test('should initialize default widgets', () => {
    expect(WidgetStore.widgets.length).toEqual(5);

    expect(hasLayoutItems('application_default')).toEqual(true);
    expect(hasLayoutItems('transfers_default')).toEqual(true);
    expect(hasLayoutItems('rss_releases')).toEqual(true);
    expect(hasLayoutItems('notepad_default')).toEqual(true);
    expect(hasLayoutItems('extensions_default')).toEqual(true);

    expect(hasLayoutItems('dummy')).toEqual(false);

    const rssSettings = WidgetStore.getWidgetSettings('rss_releases', RSSWidgetInfo);
    expect(rssSettings).toEqual({
      name: 'News',
      widget: {
        feed_url: 'https://airdcpp-web.github.io/feed.xml',
        feed_cache_minutes: 60,
      },
    });
  });

  const widgetId = createWidgetId(RSSWidgetInfo.typeId);
  const settings = {
    name: 'RSS feed',
    widget: {
      feed_url: 'http://test.com',
      feed_cache_minutes: 60,
    },
  };

  test('should handle widget actions', () => {
    WidgetStore.onCreate(widgetId, settings, RSSWidgetInfo.typeId);
    expect(hasLayoutItems(widgetId)).toEqual(true);
    expect(WidgetStore.getWidgetSettings(widgetId)).toEqual(settings);

    WidgetStore.onRemove(widgetId);
    expect(countWidgetIds(widgetId, WidgetStore.layouts)).toEqual(0);
    expect(WidgetStore.getWidgetSettings(widgetId)).toEqual(EmptyWidgetSettings);
  });
});
