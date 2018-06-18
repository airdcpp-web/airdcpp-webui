import React from 'react';

import Moment from 'moment';


const formatMediaError = (e) => {
  switch (e.target.error.code) {
  case e.target.error.MEDIA_ERR_NETWORK:
    return 'A network error caused the media download to fail';
  case e.target.error.MEDIA_ERR_DECODE:
    return 'The media playback was aborted due to a corruption problem or because the media used features your browser did not support';
  case e.target.error.MEDIA_ERR_SRC_NOT_SUPPORTED:
    return 'The media could not be loaded, either because the file was not found, network failed or because the format is not supported by your browser';
  default:
    return 'An unknown media error occurred';
  }
};

export default function (Component) {
  class MediaFileDecorator extends React.Component {
    state = {
      error: null,
    };

    UNSAFE_componentWillUpdate(nextProps, nextState) {
      // Reset the error when switching items
      if (nextProps.item !== this.props.item && this.state.error) {
        this.setState({ error: null });
      }
    }

    componentDidUpdate(prevProps, prevState) {
      if (prevProps.item !== this.props.item && this.media) {
        this.media.load();
      }
    }

    onMediaError = (event) => {
      this.setState({ error: formatMediaError(event) });
    };

    setMediaRef = (c) => {
      this.media = c;
    };

    render() {
      const { item } = this.props;
      if (this.state.error) {
        return <div>{ this.state.error }</div>;	
      }

      // Use autoplay only for recently opened files
      const diff = Moment.duration(Moment().diff(Moment.unix(item.time_opened)));
      const autoPlay = diff.asMinutes() <= 1;

      const mediaProps = {
        onError: this.onMediaError,
        autoPlay,
        controls: true,
        src: this.props.url,
      };

      return (
        <Component 
          { ...this.props } 
          mediaRef={ this.setMediaRef }
          mediaProps={ mediaProps }
        />
      );
    }
  }

  return MediaFileDecorator;
}
