'use strict';
import React from 'react';

import MediaFileDecorator, { 
  MediaFileDecoratorChildProps 
} from 'routes/Sidebar/routes/Files/decorators/MediaFileDecorator';


class AudioFile extends React.Component<MediaFileDecoratorChildProps> {
  render() {
    return (
      <audio 
        ref={ c => this.props.mediaRef(c!) } 
        { ...this.props.mediaProps }
      />
    );
  }
}

export default MediaFileDecorator(AudioFile);