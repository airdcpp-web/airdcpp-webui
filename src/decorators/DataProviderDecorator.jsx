import PropTypes from 'prop-types';
import React from 'react';
import invariant from 'invariant';

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
			urls: PropTypes.oneOfType([
				PropTypes.object,
				PropTypes.func,
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
			onSocketConnected: PropTypes.func,

			/**
			 * Key-value map of prop names and functions 
			 * Converter functions receives the fetched data as parameter
			 */
			dataConverters: PropTypes.object,

			/**
			 * Text to show while loading data (use null to disable spinner)
			 */
			loaderText: PropTypes.node,

			/**
			 * Should the decorated components handle data fetching failures?
			 */
			renderOnError: PropTypes.bool,
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
			this.mounted = true;
			this.fetchData();
		},

		componentWillUnmount() {
			this.mounted = false;
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

		refetchData(keys) {
			invariant(!keys || (Array.isArray(keys) && keys.every(key => !!this.props.urls[key])), 'Invalid keys supplied to refetchData');
			this.fetchData(keys);
		},

		fetchData(keys) {
			if (!keys) {
				keys = Object.keys(this.props.urls);
			}

			const promises = keys.map(key => {
				let url = this.props.urls[key];
				if (typeof url === 'function') {
					return url(this.props, SocketService);
				}

				return SocketService.get(url);
			});

			Promise.all(promises)
				.then(this.onDataFetched.bind(this, keys), this.onDataFetchFailed);
		},

		// Convert the data array to key-value props
		reduceData(keys, reducedData, data, index) {
			const { dataConverters } = this.props;
			const url = keys[index];
			reducedData[url] = dataConverters && dataConverters[url] ? dataConverters[url](data, this.props) : data;
			return reducedData;
		},

		onDataFetched(keys, values) {
			if (!this.mounted) {
				return;
			}

			const data = values.reduce(this.reduceData.bind(this, keys), {});

			this.mergeData(data);
		},

		onDataFetchFailed(error) {
			if (error.code && error.message) {
				// API error
				NotificationActions.apiError('Failed to fetch data', error);
			} else {
				// HTTP error
				error = {
					code: error.status,
					message: error.statusText,
				};
			}

			this.setState({
				error,
			});
		},

		render() {
			const { loaderText, dataConverter, onSocketConnected, urls, renderOnError, ...other } = this.props; // eslint-disable-line
			const { data, error } = this.state;

			if (!data && !error) {
				return loaderText && <Loader text={ loaderText }/>;
			}

			if (error && !renderOnError) {
				return null;
			}

			return (
				<Component
					refetchData={ this.refetchData }
					dataError={ error }
					{ ...other }
					{ ...data }
				/>
			);
		},
	});

	return DataProviderDecorator;
}
