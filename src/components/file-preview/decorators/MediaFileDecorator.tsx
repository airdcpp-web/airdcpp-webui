import React from 'react';

//import Moment from 'moment';


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


export interface MediaFileDecoratorChildProps extends Pick<MediaFileDecoratorProps, 'url'> {
  mediaRef: (c: HTMLMediaElement) => void;
  mediaProps: {
    onError: (event: React.SyntheticEvent<HTMLMediaElement>) => void;
    autoPlay: boolean;
    controls: boolean;
    src: string;
  };
}

export interface MediaFileDecoratorProps {
  url: string;
  autoPlay: boolean;
}

export default function (
  Component: React.ComponentType<MediaFileDecoratorChildProps>
) {
  class MediaFileDecorator extends React.Component<MediaFileDecoratorProps> {
    state = {
      error: null,
    };

    media: HTMLMediaElement;

    componentDidUpdate(prevProps: MediaFileDecoratorProps) {
      if (prevProps.url !== this.props.url) {
        if (this.media) {
          this.media.load();
        }

        // Reset the error when switching between items
        this.setState({ error: null });
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
      if (this.state.error) {
        return (
          <div>
            { this.state.error }
          </div>
        );	
      }

      const { url, autoPlay } = this.props;
      const mediaProps = {
        onError: this.onMediaError,
        autoPlay,
        controls: true,
        src: url,
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
