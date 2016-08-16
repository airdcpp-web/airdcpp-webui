import t from 'utils/tcomb-form';

module.exports = {
	typeId: 'rss',
	component: require('./components/RSS').default,
	name: 'RSS feed',
	icon: 'orange rss',
	formSettings: {
		feed_url: t.Str,
	},
	size: {
		w: 3,
		h: 5,
		minW: 2,
		minH: 3,
	},
};

