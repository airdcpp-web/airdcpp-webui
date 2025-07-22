import { memo, useMemo, useState } from 'react';
import invariant from 'invariant';

import { Responsive, WidthProvider, Layout, Layouts } from 'react-grid-layout';
import { useTranslation } from 'react-i18next';

import * as UI from '@/types/ui';

import { getModuleT } from '@/utils/TranslationUtils';
import { getWidgetInfoById, loadWidgetSettings } from '@/routes/Home/widgets/WidgetUtils';
import { Widgets } from '../widgets';
import { createHomeLayoutStore, HomeLayoutStore } from '../stores/homeLayoutSlice';
import {
  HomeLayoutBreakpoints,
  HomeLayoutColumns,
} from '../constants/HomeLayoutConstants';

import Widget from '@/routes/Home/components/Widget';
import WidgetDialog from '@/routes/Home/components/WidgetDialog';

import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

import 'fomantic-ui-css/components/card.min.css';

const ResponsiveReactGridLayout = WidthProvider(Responsive);

// Convert a layout entry to a component
const mapWidget = (
  layoutItem: Layout,
  rootWidgetT: UI.ModuleTranslator,
  layoutStore: HomeLayoutStore,
): React.ReactNode => {
  const widgetInfo = getWidgetInfoById(layoutItem.i, Widgets);
  invariant(widgetInfo, 'Widget info missing');
  if (!widgetInfo) {
    return null;
  }

  const settings = loadWidgetSettings(layoutItem.i, widgetInfo);
  return (
    <Widget
      key={layoutItem.i}
      componentId={layoutItem.i}
      widgetInfo={widgetInfo}
      settings={settings}
      rootWidgetT={rootWidgetT}
      layoutStore={layoutStore}
    />
  );
};

const WidgetLayout = memo(function WidgetLayout() {
  const [breakpoint, setBreakpoint] = useState('lg');

  const { t } = useTranslation();
  const rootWidgetT = getModuleT(
    t,
    UI.Modules.WIDGETS,
    Widgets.map((w) => w.typeId),
  );

  const layoutStore = useMemo(() => {
    const store = createHomeLayoutStore();
    store.getState().init();
    return store;
  }, []);

  const layouts = layoutStore((state) => state.layouts);

  const widgets = useMemo(() => {
    // console.debug('WidgetLayout: layouts loaded', breakpoint, layouts[breakpoint]);
    return layouts[breakpoint]
      .map((w) => mapWidget(w, rootWidgetT, layoutStore.getState()))
      .filter((widget) => widget);
  }, [layouts, breakpoint]);

  const onLayoutChanged = (layout: Layout[], layouts: Layouts) => {
    //console.debug(
    //  'WidgetLayout: saving layout',
    //  layout,
    //);

    layoutStore.getState().onLayoutChange(layout, layouts);
  };

  return (
    <>
      <ResponsiveReactGridLayout
        className="ui cards layout"
        rowHeight={50}
        onLayoutChange={onLayoutChanged}
        onBreakpointChange={(bp) => {
          // console.debug('WidgetLayout: breakpoint changed', bp);
          setBreakpoint(bp);
        }}
        breakpoints={HomeLayoutBreakpoints}
        cols={HomeLayoutColumns}
        draggableHandle=".react-grid-item .header-row .header"
        layouts={layouts}
        useCSSTransforms={false} // Causes weird bouncing issues (especially on Safari)
        measureBeforeMount={false}
      >
        {widgets}
      </ResponsiveReactGridLayout>
      <WidgetDialog rootWidgetT={rootWidgetT} layoutStore={layoutStore} />
    </>
  );
});

export default WidgetLayout;
