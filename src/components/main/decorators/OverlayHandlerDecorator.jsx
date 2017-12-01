import React from 'react';

import History from 'utils/History';


// A decorator for handling of sidebar
// This should be used with main layouts that are displayed only when socket is connected


// Return true if the sidebar should be shown
const showSidebar = (props) => {
  return History.hasSidebar(props.location);
};


export default function (Component) {
  class OverlayHandlerDecorator extends React.Component {
    componentWillMount() {
      if (showSidebar(this.props)) {
        // previousLocation must exist if overlays are present
        this.previousLocation = null;
      }
    }

    componentWillReceiveProps(nextProps) {
      if (showSidebar(nextProps)) {
        if (!this.previousLocation) {
          this.previousLocation = this.props.location;
        }
      } else {
        this.previousLocation = null;
      }
    }

    render() {
      let sidebar = false;
      if (showSidebar(this.props)) {
        sidebar = true;
      }

      return (
        <Component 
          { ...this.props } 
          sidebar={ sidebar } 
          previousLocation={ this.previousLocation }
        />
      );
    }
  }

  return OverlayHandlerDecorator;
}
