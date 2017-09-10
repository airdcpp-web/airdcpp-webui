'use strict';
import React from 'react';

import MediaFileDecorator from '../decorators/MediaFileDecorator';


class VideoFile extends React.Component {
  render() {
    return (
      <video 
        ref={ c => this.props.mediaRef(c) } 
        { ...this.props.mediaProps }
      />
    );
  }
}

export default MediaFileDecorator(VideoFile);