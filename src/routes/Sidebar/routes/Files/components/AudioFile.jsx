'use strict';
import React from 'react';
import ReactDOM from 'react-dom';

import MediaFileDecorator from '../decorators/MediaFileDecorator';


const AudioFile = React.createClass({
	componentDidMount() {
		// React doesn't support source errors yet: https://github.com/facebook/react/issues/5839
		ReactDOM.findDOMNode(this.refs.source).addEventListener('error', this.props.onError);
	},

	componentWillUnmount() {
		ReactDOM.findDOMNode(this.refs.source).removeEventListener('error', this.props.onError);
	},

	render() {
		const { mediaProps, url, type } = this.props;
		return (
			<audio { ...mediaProps }>
				<source
					ref="source"
					src={ url }
					type={ type }
					//onError={ onError }
				/>
			</audio>
		);
	}
});

export default MediaFileDecorator(AudioFile);