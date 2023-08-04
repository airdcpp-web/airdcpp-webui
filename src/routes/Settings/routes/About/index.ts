import AccessConstants from 'constants/AccessConstants';
import { RootSectionType } from 'routes/Settings/types';

const About: RootSectionType = {
  url: 'about',
  title: 'About',
  icon: 'info',
  component: require('../../components/SettingSection').default,
  menuItems: [
    {
      title: 'Application',
      noSave: true,
      url: 'application',
      component: require('./components/ApplicationPage').default,
    },
    {
      title: 'Transfer statistics',
      noSave: true,
      url: 'transfers',
      access: AccessConstants.TRANSFERS,
      component: require('./components/TransferStatisticsPage').default,
    },
    {
      title: 'Share statistics',
      noSave: true,
      url: 'share',
      component: require('./components/ShareStatisticsPage').default,
    },
    {
      title: 'Hub statistics',
      noSave: true,
      url: 'hubs',
      access: AccessConstants.HUBS_VIEW,
      component: require('./components/HubStatisticsPage').default,
    },
  ],
};

export default About;
