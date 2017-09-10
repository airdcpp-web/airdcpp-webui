import PropTypes from 'prop-types';
import React from 'react';

export default function (Component) {
  let shouldScrollBottom = false;

  class ScrollDecorator extends React.Component {
    static propTypes = {
      /**
			 * The container will always be scrolled to bottom if the session changes
			 */
      session: PropTypes.any,
    };

    componentDidMount() {
      this._scrollToBottom();
    }

    componentWillUpdate(nextProps, nextState) {
      if (nextProps.session && nextProps.session.id !== this.props.session.id) {
        shouldScrollBottom = true;
        return;
      }

      if (!this.scrollable) {
        shouldScrollBottom = false;
        return;
      }

      const offSetFromBottom = this.scrollable.scrollHeight - (this.scrollable.scrollTop + this.scrollable.offsetHeight);
      shouldScrollBottom = Math.abs(offSetFromBottom) < 10;
    }

    componentDidUpdate(prevProps, prevState) {
      if (shouldScrollBottom) {
        this._scrollToBottom();
      }
    }

    _scrollToBottom = () => {
      if (this.scrollable) {
        this.scrollable.scrollTop = this.scrollable.scrollHeight;
      }

      shouldScrollBottom = false;
    };

    setScrollableRef = (c) => {
      this.scrollable = c;
    };

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
