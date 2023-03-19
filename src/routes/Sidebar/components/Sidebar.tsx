import { PureComponent } from 'react';

import {
  loadLocalProperty,
  saveLocalProperty,
  useMobileLayout,
} from 'utils/BrowserUtils';
import Loader from 'components/semantic/Loader';
import { Resizable, ResizeCallback } from 're-resizable';
import History from 'utils/History';

import '../style.css';
import { Location } from 'history';
import { RouteItem, parseRoutes } from 'routes/Routes';
import { LayoutWidthContext } from 'context/LayoutWidthContext';

const MIN_WIDTH = 500;

const showSidebar = (props: SidebarProps) => {
  return !!props.previousLocation;
};

export interface SidebarProps {
  location: Location;
  previousLocation?: Location;
  routes: RouteItem[];
}

const enum Visibility {
  HIDDEN = 'hidden',
  LOADING = 'loading',
  VISIBLE = 'visible',
}
interface State {
  visibility: Visibility;
  width: number;
}

class Sidebar extends PureComponent<SidebarProps, State> {
  c: Resizable;

  static contextType = LayoutWidthContext; // Update the minimum width when the window is being resized

  constructor(props: SidebarProps) {
    super(props);
    const width = loadLocalProperty<number>('sidebar_width', 1000);

    this.state = {
      // Don't render the content while sidebar is animating
      // Avoids issues if there are router transitions while the sidebar is
      // animating (e.g. the content is placed in the middle of the window)
      visibility: Visibility.HIDDEN,
      width: Math.max(MIN_WIDTH, width),
    };
  }

  componentDidUpdate(prevProps: SidebarProps) {
    const newActive = showSidebar(this.props);
    const prevActive = showSidebar(prevProps);
    if (newActive !== prevActive) {
      if (newActive) {
        $(this.c.resizable!).sidebar('show');
      } else {
        $(this.c.resizable!).sidebar('hide');
      }
    }
  }

  componentDidMount() {
    $(this.c.resizable!).sidebar({
      context: '.sidebar-context',
      transition: 'overlay',
      mobileTransition: 'overlay',
      closable: !useMobileLayout(),
      onVisible: this.onVisible,
      onShow: this.onShow,
      onHidden: this.onHidden,
      onHide: this.onHide,
    } as SemanticUI.SidebarSettings);

    const active = showSidebar(this.props);
    if (active) {
      $(this.c.resizable!).sidebar('show');
    }
  }

  onHide = () => {
    this.setState({
      visibility: Visibility.LOADING,
    });

    const { previousLocation } = this.props;
    if (!previousLocation) {
      return;
    }

    History.replace({
      pathname: previousLocation.pathname,
      state: previousLocation.state,
    });
  };

  onHidden = () => {
    this.setState({
      visibility: Visibility.HIDDEN,
    });
  };

  onShow = () => {
    this.setState({
      visibility: Visibility.LOADING,
    });
  };

  onVisible = () => {
    this.setState({
      visibility: Visibility.VISIBLE,
    });
  };

  onResizeStop: ResizeCallback = (event, direction, element, delta) => {
    if (!delta.width) {
      return;
    }

    const width = element.clientWidth;
    saveLocalProperty('sidebar_width', width);
    this.setState({ width });
  };

  getChildren = () => {
    const { visibility, width } = this.state;
    if (visibility === Visibility.HIDDEN) {
      return null;
    }

    return (
      <LayoutWidthContext.Provider value={width}>
        <div id="sidebar-container">
          {visibility === Visibility.LOADING ? (
            <Loader text="" />
          ) : (
            parseRoutes(this.props.routes, this.props.location)
          )}
        </div>
      </LayoutWidthContext.Provider>
    );
  };

  render() {
    const { width } = this.state;

    const otherProps = {
      id: 'sidebar',
    };

    return (
      <Resizable
        ref={(c: any) => (this.c = c)}
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
        onResizeStop={this.onResizeStop}
      >
        {this.getChildren()}
      </Resizable>
    );
  }
}

export default Sidebar;
