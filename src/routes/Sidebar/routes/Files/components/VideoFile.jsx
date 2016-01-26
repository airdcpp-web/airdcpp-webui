'use strict';
import React from 'react';

import MediaFileDecorator from '../decorators/MediaFileDecorator';


const VideoFile = React.createClass({
	render() {
		return (
			<video { ...this.props.mediaProps }/>
		);
	}
});

export default MediaFileDecorator(VideoFile);