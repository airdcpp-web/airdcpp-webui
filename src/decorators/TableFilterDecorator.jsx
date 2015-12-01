import React from 'react';

import SocketService from 'services/SocketService';

export default function (Component, propertyName = 'any') {
	const TableFilterDecorator = React.createClass({
		propTypes: {
			/**
			 * Callback after the profiles have been received
			 */
			viewUrl: React.PropTypes.string,
		},

		getInitialState() {
			return {
				filterId: null,
			};
		},

		componentDidMount() {
			SocketService.post(this.props.viewUrl + '/filter').then(this.onFilterAdded);
		},

		onFilterAdded(data) {
			if (!this.isMounted()) {
				return;
			}

			this.setState({ filterId: data.id });
		},

		onFilterUpdated(pattern) {
			const data = {
				pattern: pattern,
				method: 0,
				property: propertyName,
			};

			SocketService.put(this.props.viewUrl + '/filter/' + this.state.filterId, data)
				.catch(error => console.error('Failed to add table filter'));
		},

		render() {
			if (!this.state.filterId) {
				return null;
			}

			return <Component {...this.props} onFilterUpdated={this.onFilterUpdated}/>;
		},
	});

	return TableFilterDecorator;
}