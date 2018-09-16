import React from 'react';

import Moment from 'moment';
import { FileSessionContentProps } from 'routes/Sidebar/routes/Files/components/FileSession';


const formatMediaError = (event: React.SyntheticEvent<HTMLMediaElement>) => {
  const error: MediaError = (event.target as any).error;
  switch (error.code) {
    case error.MEDIA_ERR_NETWORK:
      return 'A network error caused the media download to fail';
    case error.MEDIA_ERR_DECODE:
      // tslint:disable-next-line:max-line-length
      return 'The media playback was aborted due to a corruption problem or because the media used features your browser did not support';
    case error.MEDIA_ERR_SRC_NOT_SUPPORTED:
      // tslint:disable-next-line:max-line-length
      return 'The media could not be loaded, either because the file was not found, network failed or because the format is not supported by your browser';
    default:
      return 'An unknown media error occurred';
  }
};


export interface MediaFileDecoratorChildProps extends FileSessionContentProps {
  mediaRef: (c: HTMLMediaElement) => void;
  mediaProps: {
    onError: (event: React.SyntheticEvent<HTMLMediaElement>) => void;
    autoPlay: boolean;
    controls: boolean;
    src: string;
  };
}

export default function (
  Component: React.ComponentType<MediaFileDecoratorChildProps>
) {
  class MediaFileDecorator extends React.Component<FileSessionContentProps> {
    state = {
      error: null,
    };

    media: HTMLMediaElement;

    UNSAFE_componentWillUpdate(nextProps: FileSessionContentProps) {
      // Reset the error when switching items
      if (nextProps.item !== this.props.item && this.state.error) {
        this.setState({ error: null });
      }
    }

    componentDidUpdate(prevProps: FileSessionContentProps) {
      if (prevProps.item !== this.props.item && this.media) {
        this.media.load();
      }
    }

    onMediaError = (event: React.SyntheticEvent<HTMLMediaElement>) => {
      this.setState({ 
        error: formatMediaError(event) 
      });
    }

    setMediaRef = (c: HTMLMediaElement) => {
      this.media = c;
    }

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
