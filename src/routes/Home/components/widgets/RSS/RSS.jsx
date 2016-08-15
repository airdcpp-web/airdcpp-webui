import React from 'react';

import t from 'utils/tcomb-form';

import Loader from 'components/semantic/Loader';
import Message from 'components/semantic/Message';

import { ActionMenu } from 'components/menu/DropdownMenu';
import RSSActions from './RSSActions';
import RedrawDecorator from 'decorators/RedrawDecorator';

import ValueFormat from 'utils/ValueFormat';

import './style.css';


const Entry = ({ entry, location, componentId }) => {
	return (
		<div className="item">
			<div className="header">
				<ActionMenu 
					leftIcon={ true }
					caption={ entry.title }
					actions={ RSSActions }
					itemData={ entry }
					//contextGetter={ _ => '.' + componentId + ' .list.rss' }
				/>
			</div>

			<div className="description">
				{ entry.pubDate ? ValueFormat.formatRelativeTime(Date.parse(entry.pubDate) / 1000) : null }
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
		$.getJSON('https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20xml%20where%20url%20%3D%20\'' + 
			encodeURIComponent(feedUrl) + '\'&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback=', 

		res => {
			console.log(res);
			this.onFeedFetched(res.query);
		}, 'jsonp');
	},

	componentWillReceiveProps(nextProps) {
		if (nextProps.settings.feed_url !== this.props.settings.feed_url) {
			this.setState({ entries: null });
			this.fetchFeed(nextProps.settings.feed_url);
		}
	},

	getInitialState() {
		return {
			entries: null,
			error: null,
		};
	},

	onFeedFetched(data) {
		if (!data.results) {
			this.setState({
				error: 'The URL is invalid or the feed is empty',
			});

			return;
		}

		if (data.results.error) {
			this.setState({
				error: data.results.error.description,
			});

			return;
		}

		if (!data.results.rss || !data.results.rss.channel || !data.results.rss.channel.item) {
			this.setState({
				error: 'Invalid feed',
			});

			return;
		}

		this.setState({
			error: null,
			entries: data.results.rss.channel.item,
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
			<div className="rss">
				<div className="ui divided list rss">
				  { 
			  		this.state.entries.map(entry => (
			  			<Entry 
			  				key={ entry.guid && entry.guid.content ? entry.guid.content : entry.guid } 
			  				entry={ entry }
			  				componentId={ this.props.componentId }
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

export default {
	id: 'rss',
	component: RSS,
	name: 'RSS feed',
	icon: 'rss',
	formSettings: {
		feed_url: t.Str,
	},
	size: {
		w: 4,
		h: 5,
		minW: 2,
		minH: 3,
	},
};