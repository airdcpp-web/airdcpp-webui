import React from 'react';

import History from 'utils/History';
import { Location } from 'history';


// A decorator for handling of sidebar
// This should be used with main layouts that are displayed only when socket is connected


export interface SidebarHandlerDecoratorProps {
  location: Location;
}

export interface SidebarHandlerDecoratorChildProps {
  location: Location;
  sidebar: boolean;
  previousLocation: Location | null;
}

// Return true if the sidebar should be shown
const showSidebar = (props: SidebarHandlerDecoratorProps) => {
  return History.hasSidebar(props.location);
};

export default function <PropsT>(
  Component: React.ComponentType<PropsT & SidebarHandlerDecoratorChildProps>
) {
  class SidebarHandlerDecorator extends React.Component<PropsT & SidebarHandlerDecoratorProps> {
    previousLocation: Location | null = null;

    componentDidMount() {
      if (showSidebar(this.props)) {
        // previousLocation must exist if overlays are present
        this.previousLocation = null;
      }
    }

    UNSAFE_componentWillReceiveProps(nextProps: SidebarHandlerDecoratorProps) {
      // Save the return location for sidebar
      // Also save the location before opening modals as they shouldn't be used as
      // return locations
      if (showSidebar(nextProps) || History.getModalIds(nextProps.location)) {
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
          previousLocation={ sidebar ? this.previousLocation : null }
        />
      );
    }
  }

  return SidebarHandlerDecorator;
}
