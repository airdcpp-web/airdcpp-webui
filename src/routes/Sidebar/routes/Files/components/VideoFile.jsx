'use strict';
import React from 'react';

import MediaFileDecorator from '../decorators/MediaFileDecorator';


const VideoFile = React.createClass({
  render() {
    return (
      <video 
        ref={ c => this.props.mediaRef(c) } 
        { ...this.props.mediaProps }
      />
    );
  }
});

export default MediaFileDecorator(VideoFile);