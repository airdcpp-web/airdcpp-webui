'use strict';
import React from 'react';

import LocalSettingStore from 'stores/LocalSettingStore';
import { LocalSettings } from 'constants/SettingConstants';

// This decorator will fire updates for currently active session
// and set them as read
export default function (Component) {
	const ActiveSessionDecorator = React.createClass({
		propTypes: {
			session: React.PropTypes.any, // Required (cloned)
			actions: React.PropTypes.object, // Required (cloned)
		},

		setRead(id) {
			this.props.actions.setRead(id);
			this.readTimeout = null;
		},

		setSession(id) {
			if (this.readTimeout) {
				clearTimeout(this.readTimeout);
				this.setRead(this.props.session.id);
			}

			this.props.actions.sessionChanged(id);
			if (!id) {
				return;
			}

			this.readTimeout = setTimeout(_ => this.setRead(id), LocalSettingStore.getValue(LocalSettings.UNREAD_LABEL_DELAY) * 1000);
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
