import * as React from 'react';

import MediaFileDecorator, {
  MediaFileDecoratorChildProps,
} from './decorators/MediaFileDecorator';

const VideoFile: React.FC<MediaFileDecoratorChildProps> = ({ mediaRef, mediaProps }) => (
  <video
    ref={mediaRef as React.Ref<HTMLVideoElement>}
    style={{
      maxWidth: '100%',
      maxHeight: '100%',
    }}
    {...mediaProps}
  />
);

const VideoFileDecorated = MediaFileDecorator(VideoFile);

export { VideoFileDecorated as VideoFile };
