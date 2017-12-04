import PropTypes from 'prop-types';
import React from 'react';

import BrowserUtils from 'utils/BrowserUtils';
import Loader from 'components/semantic/Loader';
import Resizable from 're-resizable';
import History from 'utils/History';

import '../style.css';


const MIN_WIDTH = 500;

class Sidebar extends React.PureComponent {
  static propTypes = {
    context: PropTypes.string,
  };

  constructor(props) {
    super(props);
    const width = BrowserUtils.loadLocalProperty('sidebar_width', 1000);

    this.state = {
      // Don't render the content while sidebar is animating
      // Avoids issues if there are router transitions while the sidebar is 
      // animating (e.g. the content is placed in the middle of the window)
      animating: true,
      width: Math.max(MIN_WIDTH, width),
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.location.state.sidebar.data.close) {
      $(this.c.resizable).sidebar('hide');
    }
  }

  componentDidMount() {
    $(this.c.resizable).sidebar({
      context: '.sidebar-context',
      transition: 'overlay',
      mobileTransition: 'overlay',
      closable: !BrowserUtils.useMobileLayout(),
      onShow: this.onVisible,
      onHidden: this.onHidden,
    }).sidebar('show');
  }

  onHidden = () => {
    History.removeOverlay(this.props.location, 'sidebar');
  };

  onVisible = () => {
    this.setState({ animating: false });
  };

  onResizeStop = (event, direction, element, delta) => {
    if (!delta.width) {
      return;
    }

    const width = element.clientWidth;
    BrowserUtils.saveLocalProperty('sidebar_width', width);
    this.setState({ width });
  };

  render() {
    const { width, animating } = this.state;
    return (
      <Resizable
        ref={ c => this.c = c }
        size={ {
          width: Math.min(width, window.innerWidth),
          height: window.innerHeight,
        } }
        minWidth={ Math.min(MIN_WIDTH, window.innerWidth) }
        maxWidth={ window.innerWidth } 
        id="sidebar"
        className="ui right vertical sidebar"

        enable={
          { top:false, right:false, bottom:false, left: !BrowserUtils.useMobileLayout(), topRight:false, bottomRight:false, bottomLeft:false, topLeft:false }
        }
        onResizeStop={ this.onResizeStop }
      >
        <div id="sidebar-container">
          { animating ? <Loader text=""/> : /*React.Children.map(this.props.children, child => React.cloneElement(child, {
            width,
          }))*/this.props.children }
        </div>
      </Resizable>
    );
  }
}

export default Sidebar;
