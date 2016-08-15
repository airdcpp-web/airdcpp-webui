'use strict';
import Reflux from 'reflux';

import IconConstants from 'constants/IconConstants';
import AccessConstants from 'constants/AccessConstants';

import DownloadableItemActions from 'actions/DownloadableItemActions';


const hasLink = entry => entry.link;

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

RSSActions.openLink.listen(function (entry, location) {
	window.open(entry.link);
});

RSSActions.search.listen(function (entry, location) {
	const item = {
		itemInfo: {
			name: entry.title,
		},
	};

	return DownloadableItemActions.search(item, location);
});

export default RSSActions;
