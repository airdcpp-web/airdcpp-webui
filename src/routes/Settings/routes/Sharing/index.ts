import { RootSectionType } from '@/routes/Settings/types';

import * as API from '@/types/api';

import SettingSection from '../../components/SettingSection';

import RefreshOptionsPage from './components/RefreshOptionsPage';
import ShareProfilesPage from './components/ShareProfilesPage';
import SharingOptionsPage from './components/SharingOptionsPage';
import HashingPage from './components/HashingPage';
import ExcludePage from './components/ExcludePage';

const Sharing: RootSectionType = {
  url: 'sharing',
  title: 'Sharing',
  icon: 'tasks',
  component: SettingSection,
  menuItems: [
    {
      title: 'Refresh options',
      url: 'refresh-options',
      component: RefreshOptionsPage,
    },
    {
      title: 'Share profiles',
      url: 'profiles',
      noSave: true,
      component: ShareProfilesPage,
      access: API.AccessEnum.SHARE_VIEW,
    },
  ],
  advancedMenuItems: [
    {
      title: 'Sharing options',
      url: 'sharing-options',
      component: SharingOptionsPage,
    },
    {
      title: 'Hashing',
      url: 'hashing',
      component: HashingPage,
    },
    {
      title: 'Excluded paths',
      url: 'excludes',
      noSave: true,
      component: ExcludePage,
      access: API.AccessEnum.SHARE_VIEW,
    },
  ],
};

export default Sharing;
