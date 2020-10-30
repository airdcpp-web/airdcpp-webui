import * as React from 'react';

import MediaFileDecorator, { 
  MediaFileDecoratorChildProps 
} from './decorators/MediaFileDecorator';


const AudioFile: React.FC<MediaFileDecoratorChildProps> = ({ mediaRef, mediaProps }) => (
  <audio 
    ref={ mediaRef } 
    style={{
      maxWidth: '100%',
      maxHeight: '100%',
    }}
    { ...mediaProps }
  />
);

const AudioFileDecorated = MediaFileDecorator(AudioFile);

export { AudioFileDecorated as AudioFile };
