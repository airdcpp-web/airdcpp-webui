'use strict';
import React from 'react';


const VideoFile = ({ url, item, extension }) => {
	// Force mp4 type because support for different video formats is quite limited (but it still may work)
	return (
		<video controls>
			<source
				src={ url }
				type="video/mp4"
			/>
			{ "Your browser doesn't support HTML5 video for " + extension + ' files' }
		</video>
	);
};

export default VideoFile;