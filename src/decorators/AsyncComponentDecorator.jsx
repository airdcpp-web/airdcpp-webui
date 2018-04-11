import React from 'react';

// getComponent is a function that returns a promise for a component
// It will not be called until the first mount
export default function asyncComponent(getComponent, props) {
  return class AsyncComponent extends React.Component {
    static Component = null;
    state = { Component: AsyncComponent.Component };

    componentDidMount() {
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
        return (
          <Component { ...this.props } { ...props }/>
        );
      }
      return null;
    }
  };
}