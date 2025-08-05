import { RootSectionType } from '@/routes/Settings/types';

import SettingSection from '../../components/SettingSection';

import LocationsPage from './components/LocationsPage';
import SkippingOptionsPage from './components/SkippingOptionsPage';
import SearchMatchingPage from './components/SearchMatchingPage';
import DownloadOptionsPage from './components/DownloadOptionsPage';
import PrioritiesPage from './components/PrioritiesPage';
import SearchTypesPage from './components/SearchTypesPage';

const Downloads: RootSectionType = {
  url: 'downloads',
  title: 'Downloads',
  icon: 'download',
  component: SettingSection,
  menuItems: [
    {
      title: 'Locations',
      url: 'locations',
      component: LocationsPage,
    },
  ],
  advancedMenuItems: [
    {
      title: 'Skipping options',
      url: 'skipping-options',
      component: SkippingOptionsPage,
    },
    {
      title: 'Search matching',
      url: 'search-matching',
      component: SearchMatchingPage,
    },
    {
      title: 'Download options',
      url: 'download-options',
      component: DownloadOptionsPage,
    },
    {
      title: 'Priorities',
      url: 'priorities',
      component: PrioritiesPage,
    },
    {
      title: 'Search types',
      url: 'search-types',
      component: SearchTypesPage,
    },
  ],
};

export default Downloads;
