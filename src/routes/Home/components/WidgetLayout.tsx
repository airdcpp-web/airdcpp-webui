import { useState } from 'react';
import * as React from 'react';
import invariant from 'invariant';

import Widget from 'routes/Home/components/Widget';
import WidgetDialog from 'routes/Home/components/WidgetDialog';

import { Responsive, WidthProvider, Layout, Layouts } from 'react-grid-layout';
import WidgetStore from 'stores/WidgetStore';

import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

import 'fomantic-ui-css/components/card.min.css';
import { useStore } from 'effects/StoreListenerEffect';

import { useTranslation } from 'react-i18next';
import * as UI from 'types/ui';
import { getModuleT } from 'utils/TranslationUtils';

const ResponsiveReactGridLayout = WidthProvider(Responsive);

// Convert a layout entry to a component
const mapWidget = (
  layoutItem: Layout,
  rootWidgetT: UI.ModuleTranslator,
): React.ReactNode => {
  const widgetInfo = WidgetStore.getWidgetInfoById(layoutItem.i!);
  invariant(widgetInfo, 'Widget info missing');
  if (!widgetInfo) {
    return null;
  }

  const settings = WidgetStore.getWidgetSettings(layoutItem.i!, widgetInfo);
  return (
    <Widget
      key={layoutItem.i}
      componentId={layoutItem.i!}
      widgetInfo={widgetInfo}
      settings={settings}
      data-grid={layoutItem}
      rootWidgetT={rootWidgetT}
    />
  );
};

const WidgetLayout = React.memo(function WidgetLayout() {
  const [breakpoint, setBreakpoint] = useState('lg');

  const { t } = useTranslation();
  const rootWidgetT = getModuleT(
    t,
    UI.Modules.WIDGETS,
    WidgetStore.widgets.map((w) => w.typeId),
  );
  const layouts = useStore<Layouts>(
    WidgetStore /*, () => {
      WidgetStore.ensureDefaultWidgets(t);
    }*/,
  );

  return (
    <>
      <ResponsiveReactGridLayout
        className="ui cards layout"
        rowHeight={50}
        // width={ 1200 }
        onLayoutChange={WidgetStore.onLayoutChange}
        onBreakpointChange={(bp) => setBreakpoint(bp)}
        breakpoints={WidgetStore.breakpoints}
        cols={WidgetStore.cols}
        draggableHandle=".react-grid-item .header-row .header"
        layouts={layouts}
      >
        {layouts[breakpoint]
          .map((w) => mapWidget(w, rootWidgetT))
          .filter((widget) => widget)}
      </ResponsiveReactGridLayout>
      <WidgetDialog rootWidgetT={rootWidgetT} />
    </>
  );
});

export default WidgetLayout;
