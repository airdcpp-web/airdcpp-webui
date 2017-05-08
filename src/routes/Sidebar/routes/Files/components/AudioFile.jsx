'use strict';
import React from 'react';

import MediaFileDecorator from '../decorators/MediaFileDecorator';


const AudioFile = React.createClass({
	render() {
		return (
			<audio 
				ref={ c => this.props.mediaRef(c) } 
				{ ...this.props.mediaProps }
			/>
		);
	}
});

export default MediaFileDecorator(AudioFile);