import { RSSWidgetInfo } from '../../widgets/RSS';

import { Layouts, Layout } from 'react-grid-layout';
import {
  createWidgetId,
  EmptyWidgetSettings,
  loadWidgetSettings,
} from '@/routes/Home/widgets/WidgetUtils';
import { describe, expect, test } from 'vitest';
import { HomeLayoutColumns } from '../../constants/HomeLayoutConstants';
import { createHomeLayoutStore } from '../homeLayoutSlice';

const countWidgetIds = (id: string, layouts: Layouts) => {
  return Object.keys(layouts).reduce((sum, key) => {
    if (layouts[key].find((layoutItem: Layout) => layoutItem.i === id)) {
      return sum + 1;
    }

    return sum;
  }, 0);
};

const hasLayoutItems = (id: string, layouts: Layouts) => {
  return countWidgetIds(id, layouts) === Object.keys(HomeLayoutColumns).length;
};

describe('widget store', () => {
  test('should initialize default widgets', () => {
    const layoutStore = createHomeLayoutStore();
    layoutStore.getState().init();

    const layouts = layoutStore.getState().layouts;

    // expect(WidgetStore.widgets.length).toEqual(5);

    expect(hasLayoutItems('application_default', layouts)).toEqual(true);
    expect(hasLayoutItems('transfers_default', layouts)).toEqual(true);
    expect(hasLayoutItems('rss_releases', layouts)).toEqual(true);
    expect(hasLayoutItems('notepad_default', layouts)).toEqual(true);
    expect(hasLayoutItems('extensions_default', layouts)).toEqual(true);

    expect(hasLayoutItems('dummy', layouts)).toEqual(false);

    const rssSettings = loadWidgetSettings('rss_releases', RSSWidgetInfo);
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
    const layoutStore = createHomeLayoutStore();

    layoutStore.getState().createWidget(widgetId, settings, RSSWidgetInfo.typeId);
    expect(hasLayoutItems(widgetId, layoutStore.getState().layouts)).toEqual(true);
    expect(loadWidgetSettings(widgetId)).toEqual(settings);

    layoutStore.getState().removeWidget(widgetId);
    expect(countWidgetIds(widgetId, layoutStore.getState().layouts)).toEqual(0);
    expect(loadWidgetSettings(widgetId)).toEqual(EmptyWidgetSettings);
  });
});
