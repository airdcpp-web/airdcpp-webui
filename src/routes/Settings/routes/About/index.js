const AccessConstants = require('constants/AccessConstants').default;

module.exports = {
  url: 'about',
  title: 'About',
  icon: 'info',
  component: require('../../components/SettingSection').default, 
  menuItems: [
    { 
      title: 'Application', 
      noSave: true,
      url: 'application',
      component: require('./components/AboutPage').default, 
    }, { 
      title: 'Transfer statistics', 
      noSave: true,
      url: 'transfers',
      access: AccessConstants.TRANSFERS,
      component: require('./components/TransferStatisticsPage').default, 
    }, { 
      title: 'Share statistics', 
      noSave: true,
      url: 'share',
      component: require('./components/ShareStatisticsPage').default, 
    }, { 
      title: 'Hub statistics', 
      noSave: true,
      url: 'hubs',
      access: AccessConstants.HUBS_VIEW,
      component: require('./components/HubStatisticsPage').default, 
    },
  ],
};