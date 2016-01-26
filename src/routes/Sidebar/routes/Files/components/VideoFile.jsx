'use strict';
import React from 'react';

import MediaFileDecorator from '../decorators/MediaFileDecorator';


const VideoFile = React.createClass({
	// Force mp4 type because support for different video formats is quite limited (but it still may work)
	render() {
		const { mediaProps, url } = this.props;
		return (
			<video { ...mediaProps }>
				<source
					src={ url }
					type="video/mp4"
				/>
			</video>
		);
	}
});

// { "Your browser doesn't support HTML5 video for " + extension + ' files' }
export default MediaFileDecorator(VideoFile);