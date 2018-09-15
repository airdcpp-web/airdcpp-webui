//import PropTypes from 'prop-types';
import React from 'react';

import { loadLocalProperty, saveLocalProperty, useMobileLayout } from 'utils/BrowserUtils';
import Loader from 'components/semantic/Loader';
import Resizable, { ResizeCallback } from 're-resizable';
import History from 'utils/History';

import '../style.css';
import { Location } from 'history';


const MIN_WIDTH = 500;

export interface SidebarProps {
  location: Location;
}

interface State {
  animating: boolean;
  width: number;
}

class Sidebar extends React.Component<SidebarProps, State> {
  c: Resizable;

  constructor(props: SidebarProps) {
    super(props);
    const width = loadLocalProperty('sidebar_width', 1000);

    this.state = {
      // Don't render the content while sidebar is animating
      // Avoids issues if there are router transitions while the sidebar is 
      // animating (e.g. the content is placed in the middle of the window)
      animating: true,
      width: Math.max(MIN_WIDTH, width),
    };
  }

  UNSAFE_componentWillReceiveProps(nextProps: SidebarProps) {
    if (nextProps.location.state.sidebar.data.close) {
      $(this.c.resizable).sidebar('hide');
    }
  }

  componentDidMount() {
    $(this.c.resizable).sidebar({
      context: '.sidebar-context',
      transition: 'overlay',
      mobileTransition: 'overlay',
      closable: !useMobileLayout(),
      onShow: this.onVisible,
      onHidden: this.onHidden,
    }).sidebar('show');
  }

  componentWillUnmount() {
    if (this.c) {
      $(this.c.resizable).sidebar('hide');
    }
  }

  onHidden = () => {
    History.removeOverlay(this.props.location, 'sidebar');
  }

  onVisible = () => {
    this.setState({ animating: false });
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
    const { width, animating } = this.state;
    return (
      <Resizable
        ref={ (c: any) => this.c = c }
        size={ {
          width: Math.min(width, window.innerWidth),
          height: window.innerHeight,
        } }
        minWidth={ Math.min(MIN_WIDTH, window.innerWidth) }
        maxWidth={ window.innerWidth } 
        id="sidebar"
        className="ui right vertical sidebar"

        enable={{ 
          top: false, right: false, bottom: false, left: !useMobileLayout(), 
          topRight: false, bottomRight: false, bottomLeft: false, topLeft: false 
        }}
        onResizeStop={ this.onResizeStop }
      >
        <div id="sidebar-container">
          { animating ? <Loader text=""/> : this.props.children }
        </div>
      </Resizable>
    );
  }
}

export default Sidebar;
