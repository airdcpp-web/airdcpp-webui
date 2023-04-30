import { useContext, useEffect, useRef, useState } from 'react';

import {
  loadLocalProperty,
  saveLocalProperty,
  useMobileLayout,
} from 'utils/BrowserUtils';
import Loader from 'components/semantic/Loader';
import { Resizable, ResizeCallback } from 're-resizable';

import '../style.css';
import { RouteItem, parseRoutes } from 'routes/Routes';
import { LayoutWidthContext } from 'context/LayoutWidthContext';
import { Location, Routes, useNavigate } from 'react-router-dom';

const MIN_WIDTH = 500;

const showSidebar = (props: SidebarProps) => {
  return !!props.previousLocation;
};

export interface SidebarProps {
  // location: Location;
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

  // Update the minimum width when the window is being resized
  useContext(LayoutWidthContext);

  // Don't render the content while sidebar is animating
  // Avoids issues if there are router transitions while the sidebar is
  // animating (e.g. the content is placed in the middle of the window)
  const [visibility, setVisibility] = useState(Visibility.HIDDEN);

  const [width, setWidth] = useState(
    Math.max(MIN_WIDTH, loadLocalProperty<number>('sidebar_width', 1000))
  );
  const resizable = useRef<Resizable>(null);

  useEffect(() => {
    if (resizable.current) {
      const shouldShow = showSidebar(props);
      if (shouldShow && visibility === Visibility.HIDDEN) {
        $(resizable.current).sidebar('show');
      } else if (!shouldShow && visibility === Visibility.VISIBLE) {
        $(resizable.current).sidebar('hide');
      }
    }
  }, [showSidebar(props)]);

  useEffect(() => {
    const onHide = () => {
      setVisibility(Visibility.LOADING);

      const { previousLocation } = props;
      if (!previousLocation) {
        return;
      }

      navigate(previousLocation.pathname, {
        state: previousLocation.state,
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

    if (resizable.current) {
      $(resizable.current).sidebar({
        context: '.sidebar-context',
        transition: 'overlay',
        mobileTransition: 'overlay',
        closable: !useMobileLayout(),
        onVisible: onVisible,
        onShow: onShow,
        onHidden: onHidden,
        onHide: onHide,
      } as SemanticUI.SidebarSettings);

      const active = showSidebar(props);
      if (active) {
        $(resizable.current).sidebar('show');
      }
    }
  }, []);

  const onResizeStop: ResizeCallback = (event, direction, element, delta) => {
    if (!delta.width) {
      return;
    }

    const width = element.clientWidth;
    saveLocalProperty('sidebar_width', width);
    setWidth(width);
  };

  const getChildren = () => {
    if (visibility === Visibility.HIDDEN) {
      return null;
    }

    // const { location } = props;
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
        width: Math.min(width, window.innerWidth),
        height: window.innerHeight,
      }}
      minWidth={Math.min(MIN_WIDTH, window.innerWidth)}
      maxWidth={window.innerWidth}
      className="ui right vertical sidebar"
      {...otherProps}
      enable={{
        top: false,
        right: false,
        bottom: false,
        left: !useMobileLayout(),
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

export default Sidebar;
