module.exports = {
  url: 'extensions',
  title: 'Extensions',
  icon: 'puzzle',
  component: require('../../components/SettingSection').default,
  menuItems: [
    {
      title: 'Manage installed',
      url: 'manage',
      noSave: true,
      component: require('./components/ExtensionsManagePage').default,
    },
    {
      title: 'Extension catalog',
      url: 'packages',
      noSave: true,
      component: require('./components/ExtensionsBrowsePage').default,
    },
  ],
  advancedMenuItems: [
    {
      title: 'Extension options',
      url: 'extension-options',
      component: require('./components/ExtensionsOptionsPage').default,
    },
    {
      title: 'Extension engines',
      url: 'extension-engines',
      component: require('./components/ExtensionEnginesPage').default,
    },
  ],
};
