import { RootSectionType } from '@/routes/Settings/types';

const SpeedLimits: RootSectionType = {
  url: 'speed-limits',
  title: 'Speed and limits',
  icon: 'dashboard',
  component: require('../../components/SettingSection').default,
  menuItems: [
    {
      title: 'Connection speed',
      url: 'speed',
      component: require('./components/SpeedPage').default,
    },
    {
      title: 'Bandwidth limiting',
      url: 'limiter',
      component: require('./components/LimiterPage').default,
    },
  ],
  advancedMenuItems: [
    {
      title: 'Download limits',
      url: 'download-limits',
      component: require('./components/DownloadLimitPage').default,
    },
    {
      title: 'Upload limits',
      url: 'upload-limits',
      component: require('./components/UploadLimitPage').default,
    },
    {
      title: 'Per-user limits',
      url: 'user-limits',
      component: require('./components/UserLimitPage').default,
    },
  ],
};

export default SpeedLimits;
