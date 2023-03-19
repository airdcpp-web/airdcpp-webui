module.exports = {
  url: 'connectivity',
  title: 'Connectivity',
  icon: 'signal',
  component: require('../../components/SettingSection').default,

  menuItems: [
    {
      title: 'Auto detection',
      url: 'detection',
      noSave: true,
      component: require('./components/DetectionPage').default,
    },
  ],
  advancedMenuItems: [
    {
      title: 'IPv4 connectivity (manual)',
      url: 'v4',
      component: require('./components/IPv4Page').default,
    },
    {
      title: 'IPv6 connectivity (manual)',
      url: 'v6',
      component: require('./components/IPv6Page').default,
    },
    {
      title: 'Ports (manual)',
      url: 'ports',
      component: require('./components/PortsPage').default,
    },
    {
      title: 'Proxies',
      url: 'proxies',
      component: require('./components/ProxiesPage').default,
    },
    {
      title: 'Encryption',
      url: 'encryption',
      component: require('./components/EncryptionPage').default,
    },
  ],
};
