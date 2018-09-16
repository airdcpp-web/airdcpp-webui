'use strict';
import React from 'react';

import MediaFileDecorator, { 
  MediaFileDecoratorChildProps 
} from 'routes/Sidebar/routes/Files/decorators/MediaFileDecorator';


class VideoFile extends React.Component<MediaFileDecoratorChildProps> {
  render() {
    return (
      <video 
        ref={ c => this.props.mediaRef(c!) } 
        { ...this.props.mediaProps }
      />
    );
  }
}

export default MediaFileDecorator(VideoFile);