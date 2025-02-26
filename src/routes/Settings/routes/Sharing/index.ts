import { RootSectionType } from '@/routes/Settings/types';

const Sharing: RootSectionType = {
  url: 'sharing',
  title: 'Sharing',
  icon: 'tasks',
  component: require('../../components/SettingSection').default,
  menuItems: [
    {
      title: 'Refresh options',
      url: 'refresh-options',
      component: require('./components/RefreshOptionsPage').default,
    },
    {
      title: 'Share profiles',
      url: 'profiles',
      noSave: true,
      component: require('./components/ShareProfilesPage').default,
    },
  ],
  advancedMenuItems: [
    {
      title: 'Sharing options',
      url: 'sharing-options',
      component: require('./components/SharingOptionsPage').default,
    },
    {
      title: 'Hashing',
      url: 'hashing',
      component: require('./components/HashingPage').default,
    },
    {
      title: 'Excluded paths',
      url: 'excludes',
      noSave: true,
      component: require('./components/ExcludePage').default,
    },
  ],
};

export default Sharing;
