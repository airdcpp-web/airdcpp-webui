module.exports = {
  url: 'downloads',
  title: 'Downloads',
  icon: 'download',
  component: require('../../components/SettingSection').default,
  menuItems: [
    {
      title: 'Locations',
      url: 'locations',
      component: require('./components/LocationsPage').default,
    },
  ],
  advancedMenuItems: [
    {
      title: 'Skipping options',
      url: 'skipping-options',
      component: require('./components/SkippingOptionsPage').default,
    },
    {
      title: 'Search matching',
      url: 'search-matching',
      component: require('./components/SearchMatchingPage').default,
    },
    {
      title: 'Download options',
      url: 'download-options',
      component: require('./components/DownloadOptionsPage').default,
    },
    {
      title: 'Priorities',
      url: 'priorities',
      component: require('./components/PrioritiesPage').default,
    },
    {
      title: 'Search types',
      url: 'search-types',
      component: require('./components/SearchTypesPage').default,
    },
  ],
};
