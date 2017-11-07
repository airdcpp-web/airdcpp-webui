import React from 'react';
import RouteWithSubRoutes from 'components/RouteWithSubRoutes';

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
      if (Component) {
        return [
        	<span key="routes">
        		{ this.props.routes && this.props.routes.map((route, i) => (
              <RouteWithSubRoutes key={ i } { ...route } /*{ ...this.props.location.state }*//>
            )) }
        	</span>,
        	<Component key="main" {...this.props} />
        ];
      }
      return null;
    }
  };
}