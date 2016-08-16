import t from 'utils/tcomb-form';

module.exports = {
	typeId: 'rss',
	component: require('./components/RSS').default,
	name: 'RSS feed',
	icon: 'orange rss',
	formSettings: {
		feed_url: t.Str,
	},
	fieldOptions: {
		feed_url: {
			legend: 'Feed URL',
			help: 'RSS and Atom feeds are supported',
		},
	},
	size: {
		w: 3,
		h: 5,
		minW: 2,
		minH: 3,
	},
};

