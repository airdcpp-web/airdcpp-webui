'use strict';
import React from 'react';

import MediaFileDecorator from '../decorators/MediaFileDecorator';


const AudioFile = React.createClass({
	render() {
		return (
			<audio { ...this.props.mediaProps }/>
		);
	}
});

export default MediaFileDecorator(AudioFile);