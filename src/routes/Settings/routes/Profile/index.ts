import { RootSectionType } from '@/routes/Settings/types';

import SettingSection from '../../components/SettingSection';

import UserPage from './components/UserPage';
import AwayPage from './components/AwayPage';
import IgnorePage from './components/IgnorePage';
import MiscPage from './components/MiscPage';

const Profile: RootSectionType = {
  url: 'profile',
  title: 'Profile',
  icon: 'user',
  component: SettingSection,
  menuItems: [
    {
      title: 'User',
      url: 'user',
      component: UserPage,
    },
    {
      title: 'Away mode',
      url: 'away',
      component: AwayPage,
    },
  ],
  advancedMenuItems: [
    {
      title: 'Ignored users',
      url: 'ignored-users',
      noSave: true,
      component: IgnorePage,
    },
    {
      title: 'Miscellaneous',
      url: 'miscellaneous',
      component: MiscPage,
    },
  ],
};

export default Profile;
