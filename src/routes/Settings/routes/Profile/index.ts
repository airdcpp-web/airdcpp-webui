import { RootSectionType } from '@/routes/Settings/types';

const Profile: RootSectionType = {
  url: 'profile',
  title: 'Profile',
  icon: 'user',
  component: require('../../components/SettingSection').default,
  menuItems: [
    {
      title: 'User',
      url: 'user',
      component: require('./components/UserPage').default,
    },
    {
      title: 'Away mode',
      url: 'away',
      component: require('./components/AwayPage').default,
    },
  ],
  advancedMenuItems: [
    {
      title: 'Ignored users',
      url: 'ignored-users',
      noSave: true,
      component: require('./components/IgnorePage').default,
    },
    {
      title: 'Miscellaneous',
      url: 'miscellaneous',
      component: require('./components/MiscPage').default,
    },
  ],
};

export default Profile;
