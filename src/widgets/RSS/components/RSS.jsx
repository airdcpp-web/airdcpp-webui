import React from 'react';

import Loader from 'components/semantic/Loader';
import Message from 'components/semantic/Message';

import { ActionMenu } from 'components/menu/DropdownMenu';
import RSSActions from '../actions/RSSActions';
import RedrawDecorator from 'decorators/RedrawDecorator';

import ValueFormat from 'utils/ValueFormat';

import '../style.css';


const Entry = ({ entry, location, feedUrl }) => {
	const date = entry.pubDate ? entry.pubDate : entry.updated;
	return (
		<div className="item">
			<div className="header">
				<ActionMenu 
					leftIcon={ true }
					caption={ entry.title }
					actions={ RSSActions }
					itemData={ {
						entry,
						feedUrl,
					} }
					//contextGetter={ _ => '.' + componentId + ' .list.rss' }
				/>
			</div>

			<div className="description">
				{ date ? ValueFormat.formatRelativeTime(Date.parse(date) / 1000) : null }
			</div>
		</div>
	);
};

Entry.propTypes = {
	/**
	 * Feed entry
	 */
	entry: React.PropTypes.object.isRequired,
};

const Footer = RedrawDecorator(({ lastUpdated, handleUpdate }) => (
	<div className="extra content">
		<i className="icon refresh link" onClick={ handleUpdate }/>
		{ lastUpdated ? 'Last updated: ' + ValueFormat.formatRelativeTime(lastUpdated) : null }
	</div>
), 60);

const getEntryKey = (entry) => {
	if (entry.guid && entry.guid.content) {
		return entry.guid.content;
	}

	if (entry.guid) {
		return entry.guid;
	}

	if (entry.id && entry.id.content) {
		return entry.id.content;
	}

	return entry.id;
};

const RSS = React.createClass({
	propTypes: {
		/**
		 * Current widget settings
		 */
		settings: React.PropTypes.object.isRequired,
	},

	componentWillMount() {
		this.fetchFeed(this.props.settings.feed_url);
	},

	fetchFeed(feedUrl) {
		if (this.state.entries) {
			this.setState({ entries: null });
		}

		$.getJSON('https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20xml%20where%20url%20%3D%20\'' + 
			encodeURIComponent(feedUrl) + '\'&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback=', 

		res => {
			console.log(res);
			this.onFeedFetched(res.query);
		}, 'jsonp');
	},

	componentWillReceiveProps(nextProps) {
		if (nextProps.settings.feed_url !== this.props.settings.feed_url) {
			this.fetchFeed(nextProps.settings.feed_url);
		}
	},

	getInitialState() {
		return {
			entries: null,
			error: null,
		};
	},

	setError(error) {
		this.setState({
			error
		});
	},

	onFeedFetched(data) {
		if (!data.results) {
			this.setError('The URL is invalid or the feed is empty');
			return;
		}

		if (data.results.error) {
			this.setError(data.results.error.description);
			return;
		}

		let entries = [];
		if (data.results.rss) {
			if (!data.results.rss.channel || !data.results.rss.channel.item) {
				this.setError('Invalid/unsupported feed');
				return;
			}

			entries = data.results.rss.channel.item;
		} else if (data.results.feed) {
			if (!data.results.feed.entry) {
				this.setError('Invalid/unsupported feed');
				return;
			}

			entries = data.results.feed.entry;
		} else {
			this.setError('No "rss" or "feed" tag was found');
			return;
		}

		this.setState({
			error: null,
			entries,
			lastUpdated: Date.now() / 1000,
		});
	},

	render() {
		if (this.state.error) {
			return (
				<Message
					description={ this.state.error }
					//icon={ IconConstants.ERROR }
				/>
			);
		}

		if (!this.state.entries) {
			return <Loader text="Loading feed" inline={true}/>;
		}

		return (
			<div className="rss-container">
				<div className="ui divided list rss">
				  { 
			  		this.state.entries.map(entry => (
			  			<Entry 
			  				key={ getEntryKey(entry) } 
			  				entry={ entry }
			  				//componentId={ this.props.componentId }
			  				feedUrl={ this.props.settings.feed_url }
			  			/>
			  		))
				  }
				</div>
				<Footer
					lastUpdated={ this.state.lastUpdated }
					handleUpdate={ _ => this.fetchFeed(this.props.settings.feed_url) }
				/>
			</div>
		);
	}
});

export default RSS;