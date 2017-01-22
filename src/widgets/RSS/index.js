const t = require('utils/tcomb-form').default;

module.exports = {
	typeId: 'rss',
	component: require('./components/RSS').default,
	name: 'RSS feed',
	icon: 'orange rss',
	formSettings: {
		feed_url: t.Str,
		feed_cache_minutes: t.Positive,
	},
	fieldOptions: {
		feed_url: {
			legend: 'Feed URL',
			help: 'RSS and Atom feeds are supported',
		},
		feed_cache_minutes: {
			legend: 'Minimum refetch interval (minutes)',
		},
	},
	defaultSettings: {
		feed_cache_minutes: 60,
	},
	size: {
		w: 3,
		h: 5,
		minW: 2,
		minH: 3,
	},
};

