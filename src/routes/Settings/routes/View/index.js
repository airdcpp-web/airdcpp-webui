module.exports = {
  url: 'view',
  title: 'View',
  icon: 'browser',
  component: require('../../components/SettingSection').default,
  menuItems: [
    {
      title: 'Notifications',
      url: 'notifications',
      local: true,
      component: require('./components/NotificationPage').default,
    },
    {
      title: 'Histories',
      url: 'histories',
      component: require('./components/HistoryPage').default,
    },
    {
      title: 'Events',
      url: 'events',
      component: require('./components/EventPage').default,
    },
    {
      title: 'Appearance',
      url: 'appearance',
      component: require('./components/AppearancePage').default,
    },
  ],
  advancedMenuItems: [
    {
      title: 'Miscellaneous',
      url: 'miscellaneous',
      local: true,
      component: require('./components/MiscellaneousPage').default,
    },
  ],
};
