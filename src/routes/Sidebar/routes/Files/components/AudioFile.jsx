'use strict';
import React from 'react';


const AudioFile = ({ url, item, type, extension }) => {
	return (
		<audio controls>
			<source
				src={ url }
				type={ type }
			/>
			<div>{ "Your browser doesn't support HTML5 audio for " + extension + ' files' }</div>
		</audio>
	);
};

export default AudioFile;