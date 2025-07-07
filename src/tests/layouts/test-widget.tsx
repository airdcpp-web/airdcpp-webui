import { useTranslation } from 'react-i18next';

import * as UI from '@/types/ui';

import { getModuleT } from '@/utils/TranslationUtils';

import Widget from '@/routes/Home/components/Widget';
import { createHomeLayoutStore } from '@/routes/Home/stores/homeLayoutSlice';

export const getWidgetRenderRouteContainer = (
  widget: UI.Widget,
  settings: object = {},
) => {
  const layoutStore = createHomeLayoutStore();

  const TestWidget = () => {
    const { t } = useTranslation();
    return (
      <Widget
        widgetInfo={widget}
        componentId={widget.typeId}
        settings={{
          widget: settings,
        }}
        rootWidgetT={getModuleT(t, UI.Modules.WIDGETS, [])}
        style={{
          width: '500px',
          height: '300px',
          // width: '100%',
          // height: '100%',
        }}
        layoutStore={layoutStore.getState()}
      />
    );
  };

  const routes = [
    {
      path: '/home/*',
      Component: TestWidget,
    },
  ];

  return {
    routes,
    initialEntries: ['/home'],
  };
};
