import React from 'react';

import SocketService from 'services/SocketService';
import Loader from 'components/semantic/Loader';

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
			//this.fetchProfiles();
			SocketService.post(this.props.viewUrl + '/filter').then(this.onFilterAdded);
		},

		onFilterAdded(data) {
			this.setState({ filterId: data.id });
		},

		onFilterUpdated(pattern) {
			const data = {
				pattern: pattern,
				method: 0,
				property: propertyName,
			};

			SocketService.put(this.props.viewUrl + '/filter/' + this.state.filterId, data);

			//promise.catch(error => this.failed(viewUrl, error);
		},

		render() {
			if (!this.state.filterId) {
				//return <span>Loading</span>;
				return null;
			}

			return <Component {...this.props} onFilterUpdated={this.onFilterUpdated}/>;
		},
	});

	return TableFilterDecorator;
}
