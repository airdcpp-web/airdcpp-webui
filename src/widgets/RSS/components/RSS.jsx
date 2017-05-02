import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';

import Loader from 'components/semantic/Loader';
import Message from 'components/semantic/Message';

import { ActionMenu } from 'components/menu/DropdownMenu';
import RedrawDecorator from 'decorators/RedrawDecorator';
import RSSActions from '../actions/RSSActions';

import BrowserUtils from 'utils/BrowserUtils';
import ValueFormat from 'utils/ValueFormat';

import '../style.css';


const Entry = ({ entry, feedUrl, componentId }) => {
	const date = entry.pubDate ? entry.pubDate : entry.updated;
	
	let title = typeof entry.title !== 'object' ? entry.title : entry.title.content;
	if (typeof title !== 'string') {
		title = 'Unsupported title type';
	}

	return (
		<div className="item">
			<div className="header">
				<ActionMenu 
					leftIcon={ true }
					caption={ title }
					actions={ RSSActions }
					itemData={ {
						entry,
						feedUrl,
					} }
					//contextGetter={ _ => '.' + componentId + ' .list.rss' } // TODO
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
	entry: React.PropTypes.shape({
		title: React.PropTypes.oneOfType([
			React.PropTypes.object,
			React.PropTypes.string,
		]).isRequired,
		updated: React.PropTypes.string, // Atom feeds
		pubDate: React.PropTypes.string, // RSS feeds
	}),

	feedUrl: React.PropTypes.string.isRequired,

	componentId: React.PropTypes.string.isRequired,
};

const Footer = RedrawDecorator(({ lastUpdated, handleUpdate }) => (
	<div className="extra content">
		<i className="icon refresh link" onClick={ handleUpdate }/>
		{ lastUpdated ? 'Last updated: ' + ValueFormat.formatRelativeTime(lastUpdated / 1000) : null }
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


const idToCacheKey = id => 'rss_feed_cache_' + id;

const RSS = React.createClass({
	mixins: [ PureRenderMixin ],
	propTypes: {
		/**
		 * Current widget settings
		 */
		settings: React.PropTypes.object.isRequired,

		componentId: React.PropTypes.string.isRequired,
	},

	componentWillMount() {
		if (!this.state.entries) {
			this.fetchFeed(this.props.settings.feed_url);
		}
	},

	fetchFeed(feedUrl) {
		if (this.state.entries) {
			this.setState({ entries: null });
		}

		$.getJSON('https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20xml%20where%20url%20%3D%20\'' + 
			encodeURIComponent(feedUrl) + '\'&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback=', 
			res => {
				console.log('RSS feed received', res);
				this.onFeedFetched(res.query);
			}, 
			'jsonp'
		);
	},

	componentWillReceiveProps(nextProps) {
		if (nextProps.settings.feed_url !== this.props.settings.feed_url) {
			this.fetchFeed(nextProps.settings.feed_url);
		}
	},

	getCachedFeedInfo() {
		const feedInfo = BrowserUtils.loadSessionProperty(idToCacheKey(this.props.componentId));
		if (feedInfo) {
			const feedDate = new Date(feedInfo.date).getTime();
			const lastValidDate = feedDate + (this.props.settings.feed_cache_minutes * 60 * 1000);

			if (lastValidDate >= Date.now()) {
				console.log('RSS: cached feed will be used (expires in ' + (lastValidDate - Date.now()) / 60 / 1000 + ' minutes)');
				return feedInfo;
			} else {
				console.log('RSS: cached feed had expired ' + (Date.now() - lastValidDate) / 60 / 1000 + ' minutes ago');
			}
		} else {
			console.log('RSS: no cached feed');
		}

		return null;
	},

	getInitialState() {
		const feedInfo = this.getCachedFeedInfo();
		return {
			error: null,
			...feedInfo,
		};
	},

	setError(error) {
		this.setState({
			error
		});
	},

	onFeedFetched(data) {
		if (!data.results) {
			this.setError('The URL is invalid, the feed is empty or there is a temporary issue with the feed service');
			return;
		}

		if (data.results.error) {
			this.setError(data.results.error.description);
			return;
		}

		let entries = [];
		if (data.results.rss) {
			if (!data.results.rss.channel || !data.results.rss.channel.item) {
				this.setError('Invalid/unsupported feed (no channel/item)');
				return;
			}

			entries = data.results.rss.channel.item;
		} else if (data.results.feed) {
			if (!data.results.feed.entry) {
				this.setError('Invalid/unsupported feed (no feed entry)');
				return;
			}

			entries = data.results.feed.entry;
		} else {
			this.setError('No "rss" or "feed" tag was found');
			return;
		}

		if (!Array.isArray(entries)) {
			if (typeof entries !== 'object') {
				this.setError('Invalid/unsupported feed (entries is not an array or an object)');
				return;
			}

			// Single entry, convert to an array
			entries = [ entries ];
		}

		BrowserUtils.saveSessionProperty(idToCacheKey(this.props.componentId), {
			entries,
			date: Date.now(),
		});

		this.setState({
			error: null,
			entries,
			date: Date.now(),
		});
	},

	render() {
		if (this.state.error) {
			return (
				<Message
					description={ this.state.error }
				/>
			);
		}

		if (!this.state.entries) {
			return <Loader text="Loading feed" inline={true}/>;
		}

		const feedUrl = this.props.settings.feed_url;
		return (
			<div className="rss-container">
				<div className="ui divided list rss">
				  { 
			  		this.state.entries.map(entry => (
			  			<Entry 
			  				key={ getEntryKey(entry) } 
			  				entry={ entry }
			  				componentId={ this.props.componentId }
			  				feedUrl={ feedUrl }
			  			/>
			  		))
				  }
				</div>
				<Footer
					lastUpdated={ this.state.date }
					handleUpdate={ _ => this.fetchFeed(feedUrl) }
				/>
			</div>
		);
	}
});

export default RSS;