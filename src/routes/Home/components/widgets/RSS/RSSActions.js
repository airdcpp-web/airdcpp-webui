'use strict';
import Reflux from 'reflux';

import IconConstants from 'constants/IconConstants';
import AccessConstants from 'constants/AccessConstants';

import DownloadableItemActions from 'actions/DownloadableItemActions';


const hasLink = ({ entry }) => entry.link;

export const RSSActions = Reflux.createActions([
	{ 'openLink': {
		displayName: 'Open link',
		icon: IconConstants.OPEN,
		filter: hasLink,
	} },
	{ 'search': {
		asyncResult: true,	
		displayName: 'Search',
		access: AccessConstants.SEARCH,
		icon: IconConstants.SEARCH,
	} }
]);

const getLocation = (href) => {
	var match = href.match(/^(https?\:)\/\/(([^:\/?#]*)(?:\:([0-9]+))?)(\/[^?#]*)(\?[^#]*|)(#.*|)$/);
	return match && {
		protocol: match[1],
		host: match[2],
		hostname: match[3],
		port: match[4],
		pathname: match[5],
		search: match[6],
		hash: match[7]
	};
};


RSSActions.openLink.listen(function ({ entry, feedUrl }, location) {
	let link = entry.link;
	if (entry.link.href && entry.link.href.length > 2) {
		link = entry.link.href;

		if (entry.link.href[0] === '/' && entry.link.href[1] !== '/') {
			const urlLocation = getLocation(feedUrl);
			link = urlLocation.protocol + '//' + urlLocation.host + link;
		}
	}

	window.open(link);
});

RSSActions.search.listen(function ({ entry }, location) {
	const item = {
		itemInfo: {
			name: entry.title,
		},
	};

	return DownloadableItemActions.search(item, location);
});

export default RSSActions;
