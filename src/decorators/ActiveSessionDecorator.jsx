'use strict';
import React from 'react';


// This decorator will fire updates for currently active session
// and set them as read
export default function (Component) {
	const ActiveSessionDecorator = React.createClass({
		propTypes: {
			session: React.PropTypes.any, // Required (cloned)
			actions: React.PropTypes.object, // Required (cloned)
		},

		setSession(id) {
			const { actions } = this.props;
			actions.sessionChanged(id);
			if (!id) {
				return;
			}

			actions.setRead(id);
		},

		componentDidMount() {
			this.setSession(this.props.session.id);
		},

		componentWillUnmount() {
			this.setSession(null);
		},

		componentWillReceiveProps(nextProps) {
			if (this.props.session.id != nextProps.session.id) {
				this.setSession(nextProps.session.id);
			}
		},

		render() {
			return <Component {...this.props}/>;
		},
	});

	return ActiveSessionDecorator;
}
