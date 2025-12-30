import { reject } from 'lodash';
import { Layout, ResponsiveLayouts } from 'react-grid-layout';
import { create } from 'zustand';

import * as UI from '@/types/ui';

import {
  loadLocalProperty,
  removeLocalProperty,
  saveLocalProperty,
} from '@/utils/BrowserUtils';

import {
  getWidgetInfoById,
  saveWidgetSettings,
  widgetIdToLocalStateKey,
  widgetIdToSettingKey,
} from '@/routes/Home/widgets/WidgetUtils';
import { Widgets } from '../widgets';

import { HomeLayoutColumns } from '../constants/HomeLayoutConstants';
import { createLayoutWidget, ensureDefaultLayoutWidgets } from './utils';

const LAYOUT_STORAGE_KEY = 'home_layout';
const LAYOUT_VERSION = 4;

interface StorageLayouts {
  version: number;
  items: ResponsiveLayouts;
}

interface HomeLayoutStoreState {
  layouts: ResponsiveLayouts;
}

interface HomeLayoutStoreActions {
  init: () => void;

  createWidget: (id: string, settings: UI.WidgetSettings, typeId: string) => void;
  updateWidget: (id: string, settings: UI.WidgetSettings) => void;
  removeWidget: (id: string) => void;

  onLayoutChange: (layout: Layout, layouts: ResponsiveLayouts) => void;
}

export type HomeLayoutStore = HomeLayoutStoreState & HomeLayoutStoreActions;

export const createHomeLayoutStore = () => {
  const store = create<HomeLayoutStore>()((set, get) => ({
    layouts: {} as ResponsiveLayouts,

    init: function () {
      let initialLayouts = {} as ResponsiveLayouts;

      // Try to load saved ones
      const layoutInfo = loadLocalProperty<StorageLayouts>(LAYOUT_STORAGE_KEY);
      if (layoutInfo?.items) {
        if (layoutInfo.version === LAYOUT_VERSION) {
          initialLayouts = layoutInfo.items;
        }
      }

      set({ layouts: ensureDefaultLayoutWidgets(initialLayouts) });
    },

    createWidget: (id: string, settings: UI.WidgetSettings, typeId: string) => {
      saveWidgetSettings(id, settings);

      set({
        layouts: createLayoutWidget(
          get().layouts,
          getWidgetInfoById(typeId, Widgets)!,
          id,
        ),
      });
    },

    updateWidget: (id: string, settings: UI.WidgetSettings) => {
      saveWidgetSettings(id, settings);

      set({
        layouts: {
          ...get().layouts,
        },
      });
    },

    removeWidget: (id: string) => {
      removeLocalProperty(widgetIdToSettingKey(id));
      removeLocalProperty(widgetIdToLocalStateKey(id));

      const newLayouts = Object.keys(HomeLayoutColumns).reduce((layouts, key) => {
        if (get().layouts[key]) {
          layouts[key] = reject(get().layouts[key], { i: id });
        }

        return layouts;
      }, {} as ResponsiveLayouts);

      set({ layouts: newLayouts });
    },

    onLayoutChange: (layout: Layout, layouts: ResponsiveLayouts) => {
      saveLocalProperty(LAYOUT_STORAGE_KEY, {
        version: LAYOUT_VERSION,
        items: layouts,
      });

      set({
        layouts: {
          ...layouts,
        },
      });
    },
  }));

  return store;
};

export type UseLayoutStore = ReturnType<typeof createHomeLayoutStore>;
