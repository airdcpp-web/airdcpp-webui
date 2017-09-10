import React from 'react';


export default function (Component, redrawIntervalSeconds = 60) {
  class RedrawDecorator extends React.Component {
    componentDidMount() {
      this.scheduleComponentRefresh();
    }

    componentWillUnmount() {
      clearTimeout(this.redrawTimeout);
    }

    scheduleComponentRefresh = () => {
      this.redrawTimeout = setTimeout(() => { 
        this.forceUpdate();
        this.scheduleComponentRefresh();
      }, redrawIntervalSeconds * 1000);
    };

    render() {
      return <Component {...this.props}/>;
    }
  }

  return RedrawDecorator;
};