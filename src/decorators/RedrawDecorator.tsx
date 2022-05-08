import * as React from 'react';


export default function <PropsT>(
  Component: React.ComponentType<PropsT>, 
  redrawIntervalSeconds = 60
) {
  class RedrawDecorator extends React.Component<PropsT> {
    redrawTimeout: number | undefined;

    componentDidMount() {
      this.scheduleComponentRefresh();
    }

    componentWillUnmount() {
      clearTimeout(this.redrawTimeout);
    }

    scheduleComponentRefresh = () => {
      this.redrawTimeout = window.setTimeout(
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
