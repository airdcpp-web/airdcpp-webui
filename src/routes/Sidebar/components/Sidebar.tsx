import React from 'react';

import { loadLocalProperty, saveLocalProperty, useMobileLayout } from 'utils/BrowserUtils';
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

interface State {
  contentActive: boolean;
  width: number;
}

class Sidebar extends React.Component<SidebarProps, State> {
  c: Resizable;

  constructor(props: SidebarProps) {
    super(props);
    const width = loadLocalProperty<number>('sidebar_width', 1000);

    this.state = {
      // Don't render the content while sidebar is animating
      // Avoids issues if there are router transitions while the sidebar is 
      // animating (e.g. the content is placed in the middle of the window)
      contentActive: false,
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
      onShow: this.onVisible,
      onHidden: this.onHidden,
      onHide: this.onHide,
    } as SemanticUI.SidebarSettings);
    
    const active = showSidebar(this.props);
    if (active) {
      $(this.c.resizable!).sidebar('show');
    }
  }

  onHide = () => {
    const { previousLocation } = this.props;
    if (!previousLocation) {
      return;
    }

    History.replace({
      pathname: previousLocation.pathname,
      state: previousLocation.state,
    });
  }

  onHidden = () => {
    this.setState({ 
      contentActive: false
    });
  }

  onVisible = () => {
    this.setState({ 
      contentActive: true
    });
  }

  onResizeStop: ResizeCallback = (event, direction, element, delta) => {
    if (!delta.width) {
      return;
    }

    const width = element.clientWidth;
    saveLocalProperty('sidebar_width', width);
    this.setState({ width });
  }

  render() {
    const { width, contentActive } = this.state;

    const otherProps = {
      id: 'sidebar'
    };

    return (
      <Resizable
        ref={ (c: any) => this.c = c }
        size={ {
          width: Math.min(width, window.innerWidth),
          height: window.innerHeight,
        } }
        minWidth={ Math.min(MIN_WIDTH, window.innerWidth) }
        maxWidth={ window.innerWidth }
        className="ui right vertical sidebar"
        { ...otherProps }
        enable={{ 
          top: false, right: false, bottom: false, left: !useMobileLayout(), 
          topRight: false, bottomRight: false, bottomLeft: false, topLeft: false 
        }}
        onResizeStop={ this.onResizeStop }
      >
        <LayoutWidthContext.Provider value={ width }>
          <div id="sidebar-container">
            { !contentActive ? <Loader text=""/> : parseRoutes(this.props.routes, this.props.location)  }
          </div>
        </LayoutWidthContext.Provider>
      </Resizable>
    );
  }
}

export default Sidebar;
