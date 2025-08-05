import { RootSectionType } from '@/routes/Settings/types';

import SettingSection from '../../components/SettingSection';

import DetectionPage from './components/DetectionPage';
import IPv4Page from './components/IPv4Page';
import IPv6Page from './components/IPv6Page';
import PortsPage from './components/PortsPage';

import ProxiesPage from './components/ProxiesPage';
import EncryptionPage from './components/EncryptionPage';

const Connectivity: RootSectionType = {
  url: 'connectivity',
  title: 'Connectivity',
  icon: 'signal',
  component: SettingSection,

  menuItems: [
    {
      title: 'Auto detection',
      url: 'detection',
      noSave: true,
      component: DetectionPage,
    },
  ],
  advancedMenuItems: [
    {
      title: 'IPv4 connectivity (manual)',
      url: 'v4',
      component: IPv4Page,
    },
    {
      title: 'IPv6 connectivity (manual)',
      url: 'v6',
      component: IPv6Page,
    },
    {
      title: 'Ports (manual)',
      url: 'ports',
      component: PortsPage,
    },
    {
      title: 'Proxies',
      url: 'proxies',
      component: ProxiesPage,
    },
    {
      title: 'Encryption',
      url: 'encryption',
      component: EncryptionPage,
    },
  ],
};

export default Connectivity;
