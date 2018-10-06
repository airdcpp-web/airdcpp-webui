import PropTypes from 'prop-types';
import React from 'react';

import * as API from 'types/api';


export interface SessionBase {
  id: API.IdType;
}

export interface ScrollDecoratorProps<SessionT> {
  session?: SessionT;
}

export interface ScrollDecoratorChildProps {
  scrollableRef: (component: any) => void;
}

export default function <PropsT, SessionT extends SessionBase = SessionBase>(
  Component: React.ComponentType<PropsT & ScrollDecoratorChildProps>
) {
  let shouldScrollBottom = false;

  class ScrollDecorator extends React.Component<ScrollDecoratorProps<SessionT> & PropsT> {
    static propTypes = {
      /**
       * The container will always be scrolled to bottom if the session changes
       */
      session: PropTypes.any,
    };

    scrollable: any;

    componentDidMount() {
      this.scrollToBottom();
    }

    UNSAFE_componentWillUpdate(nextProps: ScrollDecoratorProps<SessionT>) {
      if (nextProps.session && this.props.session && nextProps.session.id !== this.props.session.id) {
        shouldScrollBottom = true;
        return;
      }

      if (!this.scrollable) {
        shouldScrollBottom = false;
        return;
      }

      const { scrollHeight, scrollTop, offsetHeight } = this.scrollable;
      const offSetFromBottom = scrollHeight - (scrollTop + offsetHeight);
      shouldScrollBottom = Math.abs(offSetFromBottom) < 10;
    }

    componentDidUpdate() {
      if (shouldScrollBottom) {
        this.scrollToBottom();
      }
    }

    scrollToBottom = () => {
      if (this.scrollable) {
        this.scrollable.scrollTop = this.scrollable.scrollHeight;
      }

      shouldScrollBottom = false;
    }

    setScrollableRef = (c: any) => {
      this.scrollable = c;
    }

    render() {
      return (
        <Component 
          { ...this.props }
          scrollableRef={ this.setScrollableRef }
        />
      );
    }
  }

  return ScrollDecorator;
}
