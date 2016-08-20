import QueueActions from 'actions/QueueActions';

module.exports = {
	typeId: 'transfers',
	component: require('./components/Transfers').default,
	name: 'Transfers',
	icon: 'exchange',
	size: {
		w: 5,
		h: 5,
		minW: 2,
		minH: 5,
	},
	actionMenu: {
		actions: QueueActions,
		ids: [ 'resume', 'pause' ],
	},
};

