import React from 'react';


export default function <PropsT>(
  Component: React.ComponentType<PropsT>, 
  redrawIntervalSeconds: number = 60
) {
  class RedrawDecorator extends React.Component<PropsT> {
    redrawTimeout: any;

    componentDidMount() {
      this.scheduleComponentRefresh();
    }

    componentWillUnmount() {
      clearTimeout(this.redrawTimeout);
    }

    scheduleComponentRefresh = () => {
      this.redrawTimeout = setTimeout(
        () => { 
          this.forceUpdate();
          this.scheduleComponentRefresh();
        }, 
        redrawIntervalSeconds * 1000
      );
    }

    render() {
      return <Component {...this.props}/>;
    }
  }

  return RedrawDecorator;
}
