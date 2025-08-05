import { RootSectionType } from '@/routes/Settings/types';

import SettingSection from '../../components/SettingSection';

import NotificationPage from './components/NotificationPage';
import HistoryPage from './components/HistoryPage';
import EventPage from './components/EventPage';
import AppearancePage from './components/AppearancePage';
import MiscellaneousPage from './components/MiscellaneousPage';

const View: RootSectionType = {
  url: 'view',
  title: 'View',
  icon: 'browser',
  component: SettingSection,
  menuItems: [
    {
      title: 'Notifications',
      url: 'notifications',
      local: true,
      component: NotificationPage,
    },
    {
      title: 'Histories',
      url: 'histories',
      component: HistoryPage,
    },
    {
      title: 'Events',
      url: 'events',
      component: EventPage,
    },
    {
      title: 'Appearance',
      url: 'appearance',
      component: AppearancePage,
    },
  ],
  advancedMenuItems: [
    {
      title: 'Miscellaneous',
      url: 'miscellaneous',
      local: true,
      component: MiscellaneousPage,
    },
  ],
};

export default View;
