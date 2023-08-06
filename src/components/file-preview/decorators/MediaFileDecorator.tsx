import * as React from 'react';

const formatMediaError = (event: React.SyntheticEvent<HTMLMediaElement>) => {
  const error: MediaError = (event.target as any).error;
  switch (error.code) {
    case error.MEDIA_ERR_NETWORK:
      return 'A network error caused the media download to fail';
    case error.MEDIA_ERR_DECODE:
      // eslint-disable-next-line max-len
      return 'The media playback was aborted due to a corruption problem or because the media used features your browser did not support';
    case error.MEDIA_ERR_SRC_NOT_SUPPORTED:
      // eslint-disable-next-line max-len
      return 'The media could not be loaded, either because the file was not found, network failed or because the format is not supported by your browser';
    default:
      return 'An unknown media error occurred';
  }
};

export interface MediaFileDecoratorChildProps
  extends Pick<MediaFileDecoratorProps, 'url'> {
  mediaRef: React.Ref<HTMLMediaElement>;
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

export default function (Component: React.ComponentType<MediaFileDecoratorChildProps>) {
  const MediaFileDecorator = ({ url, autoPlay }: MediaFileDecoratorProps) => {
    const [error, setError] = React.useState<null | string>(null);

    const mediaRef = React.useRef<HTMLMediaElement>(null);

    React.useEffect(() => {
      if (mediaRef.current) {
        mediaRef.current.load();
      }

      // Reset the error when switching between items
      setError(null);
    }, [url]);

    const onMediaError = (event: React.SyntheticEvent<HTMLMediaElement>) => {
      setError(formatMediaError(event));
    };

    if (error) {
      return <div>{error}</div>;
    }

    const mediaProps = {
      onError: onMediaError,
      autoPlay,
      controls: true,
      src: url,
    };

    return <Component mediaRef={mediaRef} mediaProps={mediaProps} url={url} />;
  };

  return MediaFileDecorator;
}
