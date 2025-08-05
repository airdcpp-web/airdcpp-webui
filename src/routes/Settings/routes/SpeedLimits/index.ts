import { RootSectionType } from '@/routes/Settings/types';

import SettingSection from '../../components/SettingSection';

import SpeedPage from './components/SpeedPage';
import LimiterPage from './components/LimiterPage';
import DownloadLimitPage from './components/DownloadLimitPage';
import UploadLimitPage from './components/UploadLimitPage';
import UserLimitPage from './components/UserLimitPage';

const SpeedLimits: RootSectionType = {
  url: 'speed-limits',
  title: 'Speed and limits',
  icon: 'dashboard',
  component: SettingSection,
  menuItems: [
    {
      title: 'Connection speed',
      url: 'speed',
      component: SpeedPage,
    },
    {
      title: 'Bandwidth limiting',
      url: 'limiter',
      component: LimiterPage,
    },
  ],
  advancedMenuItems: [
    {
      title: 'Download limits',
      url: 'download-limits',
      component: DownloadLimitPage,
    },
    {
      title: 'Upload limits',
      url: 'upload-limits',
      component: UploadLimitPage,
    },
    {
      title: 'Per-user limits',
      url: 'user-limits',
      component: UserLimitPage,
    },
  ],
};

export default SpeedLimits;
