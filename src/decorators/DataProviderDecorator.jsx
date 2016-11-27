import React from 'react';

import SocketService from 'services/SocketService';
import SocketSubscriptionMixin from 'mixins/SocketSubscriptionMixin';

import Loader from 'components/semantic/Loader';
import NotificationActions from 'actions/NotificationActions';


// A decorator that will provide a set of data fetched from the API as props
export default function (Component, settings) {
	const DataProviderDecorator = React.createClass({
		mixins: [ SocketSubscriptionMixin() ],
		propTypes: {

			/**
			 * Key-value map of prop names and API urls
			 * Value may also be a function which receives the props and SocketService as argument and performs the data fetch
			 */
			urls: React.PropTypes.oneOfType([
				React.PropTypes.object,
				React.PropTypes.func,
			]), // REQUIRED

			/**
			 * Called when the socket is connected
			 * 
			 * onSocketConnected(addSocketListener, {
			 *   refetchData(),
			 *   mergeData(newData),
			 *   props,
			 * })
			 */
			onSocketConnected: React.PropTypes.func,

			/**
			 * Key-value map of prop names and functions 
			 * Converter functions receives the fetched data as parameter
			 */
			dataConverters: React.PropTypes.object,

			/**
			 * Text to show while loading data (use null to disable spinner)
			 */
			loaderText: React.PropTypes.node,

			/**
			 * Should the decorated components handle data fetching failures?
			 */
			renderOnError: React.PropTypes.bool,
		},

		getDefaultProps() {
			return {
				urls: settings.urls,
				onSocketConnected: settings.onSocketConnected,
				loaderText: settings.loaderText || 'Loading data...',
				dataConverters: settings.dataConverters,
				renderOnError: settings.renderOnError,
			};
		},

		getInitialState() {
			return {
				data: null,
				error: null,
			};
		},

		componentWillMount() {
			this.fetchData();
		},

		onSocketConnected(addSocketListener) {
			if (this.props.onSocketConnected) {
				this.props.onSocketConnected(addSocketListener, {
					refetchData: this.refetchData,
					mergeData: this.mergeData,
					props: this.props,
				});
			}
		},

		// Merge data object into existing data
		mergeData(data) {
			this.setState({
				data: Object.assign({}, this.state.data, data)
			});
		},

		refetchData() {
			this.fetchData();
		},

		fetchData() {
			const promises = Object.keys(this.props.urls).map(key => {
				let url = this.props.urls[key];
				if (typeof url === 'function') {
					return url(this.props, SocketService);
				}

				return SocketService.get(url);
			});

			Promise.all(promises)
				.then(this.onDataFetched)
				.catch(this.onDataFetchFailed);
		},

		// Convert the data array to key-value props
		reduceData(reduced, data, index) {
			const { urls, dataConverters } = this.props;
			const propKey = Object.keys(urls)[index];
			reduced[propKey] = dataConverters && dataConverters[propKey] ? dataConverters[propKey](data) : data;
			return reduced;
		},

		onDataFetched(values) {
			const data = values.reduce(this.reduceData, {});

			this.mergeData(data);
		},

		onDataFetchFailed(error) {
			NotificationActions.apiError('Failed to fetch data', error);
			this.setState({
				error,
			});
		},

		render() {
			const { loaderText, dataConverter, onSocketConnected, urls, renderOnError, ...other } = this.props; // eslint-disable-line
			const { data, error } = this.state;

			if (!data && !error) {
				if (!loaderText) {
					return null;
				}

				return <Loader text={ loaderText }/>;
			}

			if (error && !renderOnError) {
				return null;
			}

			return (
				<Component
					refetchData={ this.refetchData }
					error={ error }
					{ ...other }
					{ ...data }
				/>
			);
		},
	});

	return DataProviderDecorator;
}
