const AccessConstants = require('constants/AccessConstants').default;

module.exports = {
  url: 'about',
  title: 'About',
  icon: 'info',
  component: require('../../components/SettingSection').default, 
  menuItems: [
    { 
      title: 'Application', 
      url: 'application',
      component: require('./components/AboutPage').default, 
    }, { 
      title: 'Transfer statistics', 
      url: 'transfers',
      access: AccessConstants.TRANSFERS,
      component: require('./components/TransferStatisticsPage').default, 
    }, { 
      title: 'Share statistics', 
      url: 'share',
      component: require('./components/ShareStatisticsPage').default, 
    }, { 
      title: 'Hub statistics', 
      url: 'hubs',
      access: AccessConstants.HUBS_VIEW,
      component: require('./components/HubStatisticsPage').default, 
    },
  ],
};