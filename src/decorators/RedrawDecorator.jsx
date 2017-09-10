import React from 'react';


export default function (Component, redrawIntervalSeconds = 60) {
  const RedrawDecorator = React.createClass({
    componentDidMount() {
      this.scheduleComponentRefresh();
    },

    componentWillUnmount() {
      clearTimeout(this.redrawTimeout);
    },

    scheduleComponentRefresh() {
      this.redrawTimeout = setTimeout(() => { 
        this.forceUpdate();
        this.scheduleComponentRefresh();
      }, redrawIntervalSeconds * 1000);
    },

    render: function () {
      return <Component {...this.props}/>;
    }
  });

  return RedrawDecorator;
};