import React from 'react';

import SocketService from 'services/SocketService';
import PureRenderMixin from 'react-addons-pure-render-mixin';

import { FilterMethod } from 'constants/TableConstants';


export default function (Component, propertyName = 'any') {
	const TableFilterDecorator = React.createClass({
		mixins: [ PureRenderMixin ],
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

		onFilterUpdated(pattern, method = FilterMethod.PARTIAL) {
			const data = {
				pattern,
				method,
				property: propertyName,
			};

			SocketService.put(this.props.viewUrl + '/filter/' + this.state.filterId, data)
				.catch(error => console.error('Failed to add table filter'));
		},

		render() {
			if (this.state.filterId === null) {
				return null;
			}

			return <Component {...this.props} onFilterUpdated={this.onFilterUpdated}/>;
		},
	});

	return TableFilterDecorator;
}
