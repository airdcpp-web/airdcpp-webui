import React from 'react';
import ReactDOM from 'react-dom';

import Moment from 'moment';


export default function (Component) {
	const MediaFileDecorator = React.createClass({
		getInitialState() {
			return {
				failed: false,
			};
		},

		componentWillUpdate: function (nextProps, nextState) {
			// Reset the error when switching items
			if (nextProps.item !== this.props.item && this.state.failed) {
				this.setState({ failed: false });
			}
		},
		 
		componentDidUpdate: function (prevProps, prevState) {
			if (prevProps.item !== this.props.item && this.refs.media) {
				ReactDOM.findDOMNode(this.refs.media).load();
			}
		},

		onError() {
			this.setState({ failed: true });
		},

		render() {
			const { item } = this.props;
			if (this.state.failed) {
				return <div>{ 'Playback of  ' + item.type.str + " files isn't supported by your browser" }</div>;	
			}

			// Use autoplay only for recently opened files
			const diff = Moment.duration(Moment().diff(Moment.unix(item.time_finished)));
			const autoPlay = diff.asMinutes() <= 1;

			const mediaProps = {
				autoPlay,
				controls: true,
			};

			return (
				<Component 
					ref="media" 
					{...this.props} 
					mediaProps={ mediaProps }
					onError={ this.onError }
				/>
			);
		},
	});

	return MediaFileDecorator;
}
