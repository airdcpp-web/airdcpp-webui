import { memo, useContext, useEffect, useRef, useState } from 'react';

import {
  loadLocalProperty,
  saveLocalProperty,
  usingMobileLayout,
} from '@/utils/BrowserUtils';
import Loader from '@/components/semantic/Loader';
import { Resizable, ResizeCallback } from 're-resizable';

import { RouteItem, parseRoutes } from '@/routes/Routes';
import { Location, Routes, useNavigate } from 'react-router';

import '../style.css';
import { LayoutWidthContext, useLayoutWidth } from '@/context/LayoutWidthContext';
import { MODAL_PAGE_DIMMER_ID } from '@/components/semantic/effects/useModal';
import { appendInstanceId, UIInstanceContext } from '@/context/InstanceContext';
import { useAppStoreProperty } from '@/context/AppStoreContext';
import { LocalSettings } from '@/constants/LocalSettingConstants';

const MIN_WIDTH = 500;

const showSidebar = (props: SidebarProps) => {
  return !!props.previousLocation;
};

export interface SidebarProps {
  previousLocation?: Location;
  routes: RouteItem[];
}

const enum Visibility {
  HIDDEN = 'hidden',
  LOADING = 'loading',
  VISIBLE = 'visible',
}

const Sidebar: React.FC<SidebarProps> = (props) => {
  const navigate = useNavigate();
  const position = useAppStoreProperty((state) =>
    state.settings.getValue<string>(LocalSettings.SIDE_MENU_POSITION),
  );
  const vertical = position === 'left' || position === 'right';

  // Update the minimum width when the window is being resized
  useLayoutWidth();

  // Don't render the content while sidebar is animating
  // Avoids issues if there are router transitions while the sidebar is
  // animating (e.g. the content is placed in the middle of the window)
  const [visibility, setVisibility] = useState(Visibility.HIDDEN);

  const [width, setWidth] = useState(
    Math.max(MIN_WIDTH, loadLocalProperty<number>('sidebar_width', 1000)),
  );
  const [height, setHeight] = useState(
    Math.min(
      window.innerHeight,
      Math.max(
        300,
        loadLocalProperty<number>(
          'sidebar_height',
          Math.round(window.innerHeight * 0.72),
        ),
      ),
    ),
  );
  const resizable = useRef<Resizable>(null);

  const previousLocation = useRef<Location<any> | undefined>(undefined);
  previousLocation.current = props.previousLocation;

  const instanceId = useContext(UIInstanceContext);

  useEffect(() => {
    const onHide = () => {
      setVisibility(Visibility.LOADING);
      if (!previousLocation.current) {
        return;
      }

      navigate(previousLocation.current.pathname, {
        state: previousLocation.current.state,
      });
    };

    const onHidden = () => {
      setVisibility(Visibility.HIDDEN);
    };

    const onShow = () => {
      setVisibility(Visibility.LOADING);
    };

    const onVisible = () => {
      setVisibility(Visibility.VISIBLE);
    };

    if (resizable.current?.resizable) {
      $(resizable.current.resizable).sidebar({
        context: `#${appendInstanceId(MODAL_PAGE_DIMMER_ID, instanceId)} .sidebar-context`,
        transition: 'overlay',
        mobileTransition: 'overlay',
        closable: !usingMobileLayout(),
        onVisible: onVisible,
        onShow: onShow,
        onHidden: onHidden,
        onHide: onHide,

        duration: 10,
        // debug: true,
        // verbose: true,
      } as SemanticUI.SidebarSettings);
    }
  }, []);

  useEffect(() => {
    if (resizable.current?.resizable) {
      const shouldShow = showSidebar(props);
      if (shouldShow && visibility === Visibility.HIDDEN) {
        $(resizable.current.resizable).sidebar('show');
      } else if (!shouldShow && visibility === Visibility.VISIBLE) {
        $(resizable.current.resizable).sidebar('hide');
      }
    }
  }, [showSidebar(props)]);

  const onResizeStop: ResizeCallback = (event, direction, element, delta) => {
    if (delta.width) {
      const nextWidth = element.clientWidth;
      saveLocalProperty('sidebar_width', nextWidth);
      setWidth(nextWidth);
    }

    if (delta.height) {
      const nextHeight = element.clientHeight;
      saveLocalProperty('sidebar_height', nextHeight);
      setHeight(nextHeight);
    }
  };

  const getChildren = () => {
    if (visibility === Visibility.HIDDEN) {
      return null;
    }

    return (
      <LayoutWidthContext.Provider value={width}>
        <div id="sidebar-container">
          {visibility === Visibility.LOADING ? (
            <Loader text="" />
          ) : (
            <Routes>{parseRoutes(props.routes)}</Routes>
          )}
        </div>
      </LayoutWidthContext.Provider>
    );
  };

  const otherProps = {
    id: 'sidebar',
  };

  return (
    <Resizable
      ref={resizable}
      size={{
        width: vertical ? Math.min(width, window.innerWidth) : window.innerWidth,
        height: vertical ? window.innerHeight : Math.min(height, window.innerHeight),
      }}
      minWidth={vertical ? Math.min(MIN_WIDTH, window.innerWidth) : window.innerWidth}
      maxWidth={window.innerWidth}
      minHeight={vertical ? window.innerHeight : Math.min(300, window.innerHeight)}
      maxHeight={window.innerHeight}
      className={`ui ${position} ${vertical ? 'vertical' : ''} sidebar`}
      {...otherProps}
      enable={{
        top: position === 'bottom' && !usingMobileLayout(),
        right: position === 'left' && !usingMobileLayout(),
        bottom: position === 'top' && !usingMobileLayout(),
        left: position === 'right' && !usingMobileLayout(),
        topRight: false,
        bottomRight: false,
        bottomLeft: false,
        topLeft: false,
      }}
      onResizeStop={onResizeStop}
    >
      {getChildren()}
    </Resizable>
  );
};

export default memo(Sidebar);
