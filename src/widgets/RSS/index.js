const FieldTypes = require('constants/SettingConstants').FieldTypes;

module.exports = {
	typeId: 'rss',
	component: require('./components/RSS').default,
	name: 'RSS feed',
	icon: 'orange rss',
	formSettings: {
		feed_url: {
			title: 'Feed URL',
			type: FieldTypes.STRING,
			help: 'RSS and Atom feeds are supported',
		},
		feed_cache_minutes: {
			title: 'Minimum refetch interval (minutes)',
			type: FieldTypes.NUMBER,
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

