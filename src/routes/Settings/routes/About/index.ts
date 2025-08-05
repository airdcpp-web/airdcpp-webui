import { RootSectionType } from '@/routes/Settings/types';
import * as API from '@/types/api';

import SettingSection from '../../components/SettingSection';

import ApplicationPage from './components/ApplicationPage';
import TransferStatisticsPage from './components/TransferStatisticsPage';
import ShareStatisticsPage from './components/ShareStatisticsPage';
import HubStatisticsPage from './components/HubStatisticsPage';

const About: RootSectionType = {
  url: 'about',
  title: 'About',
  icon: 'info',
  component: SettingSection,
  menuItems: [
    {
      title: 'Application',
      noSave: true,
      url: 'application',
      component: ApplicationPage,
    },
    {
      title: 'Transfer statistics',
      noSave: true,
      url: 'transfers',
      access: API.AccessEnum.TRANSFERS,
      component: TransferStatisticsPage,
    },
    {
      title: 'Share statistics',
      noSave: true,
      url: 'share',
      access: API.AccessEnum.SHARE_VIEW,
      component: ShareStatisticsPage,
    },
    {
      title: 'Hub statistics',
      noSave: true,
      url: 'hubs',
      access: API.AccessEnum.HUBS_VIEW,
      component: HubStatisticsPage,
    },
  ],
};

export default About;
