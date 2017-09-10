'use strict';
import React from 'react';

import MediaFileDecorator from '../decorators/MediaFileDecorator';


class AudioFile extends React.Component {
  render() {
    return (
      <audio 
        ref={ c => this.props.mediaRef(c) } 
        { ...this.props.mediaProps }
      />
    );
  }
}

export default MediaFileDecorator(AudioFile);