import React from 'react';
import RouteWithSubRoutes from 'components/RouteWithSubRoutes';


const getRoutes = (routes, overlaysOnly) => {
  return routes
    .filter(route => !!route.overlayId === overlaysOnly)
    .map((route, i) => (
      <RouteWithSubRoutes key={ i } { ...route } /*{ ...this.props.location.state }*//>
    ));
};

// getComponent is a function that returns a promise for a component
// It will not be called until the first mount
export default function asyncComponent(getComponent) {
  return class AsyncComponent extends React.Component {
    static Component = null;
    state = { Component: AsyncComponent.Component };

    componentWillMount() {
      if (!this.state.Component) {
        getComponent()
        	.then(Component => Component.default)
	        .then(Component => {
	          AsyncComponent.Component = Component;
	          this.setState({ Component });
	        });
      }
    }
    
    render() {
      const { Component } = this.state;
      const { routes } = this.props;
      if (Component) {
        return [
        	<div key="overlays">
            { !!routes && getRoutes(routes, true) }
        	</div>,
        	<Component key="main" { ...this.props }>
            { !!routes && getRoutes(routes, false) }
          </Component>
        ];
      }
      return null;
    }
  };
}