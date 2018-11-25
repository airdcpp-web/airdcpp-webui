import React, { useState } from 'react';
import invariant from 'invariant';

import Widget from 'routes/Home/components/Widget';
import WidgetDialog from 'routes/Home/components/WidgetDialog';

import { Responsive, WidthProvider, Layout, Layouts } from 'react-grid-layout';
import WidgetStore from 'stores/WidgetStore';


import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

import 'semantic-ui-css/components/card.min.css';
import { useStore } from 'effects/StoreListenerEffect';

const ResponsiveReactGridLayout = WidthProvider(Responsive);


// Convert a layout entry to a component
const mapWidget = (layoutItem: Layout): React.ReactNode => {
  const widgetInfo = WidgetStore.getWidgetInfoById(layoutItem.i!);
  invariant(widgetInfo, 'Widget info missing');
  if (!widgetInfo) {
    return null;
  }

  const settings = WidgetStore.getWidgetSettings(layoutItem.i!, widgetInfo);
  return (
    <Widget
      key={ layoutItem.i }
      componentId={ layoutItem.i! }
      widgetInfo={ widgetInfo }
      settings={ settings }
      data-grid={ layoutItem }
    />
  );
};

const WidgetLayout: React.FC = React.memo(() => {
  const [ breakpoint, setBreakpoint ] = useState('lg');
  const layouts = useStore<Layouts>(WidgetStore);
  return (
    <>
      <ResponsiveReactGridLayout 
        className="ui cards layout"
        rowHeight={ 50 } 
        width={ 1200 }
        onLayoutChange={ WidgetStore.onLayoutChange }
        onBreakpointChange={ setBreakpoint }

        breakpoints={ WidgetStore.breakpoints }
        cols={ WidgetStore.cols }

        draggableHandle=".react-grid-item .header-row .header"
        layouts={ layouts }
      >
        { layouts[breakpoint]
          .map(mapWidget)
          .filter((widget: any) => widget) }
      </ResponsiveReactGridLayout>
      <WidgetDialog/>
    </>
  );
});

export default WidgetLayout;