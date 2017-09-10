'use strict';

import React from 'react';

import AccessConstants from 'constants/AccessConstants';
import SettingsMenuDecorator from '../decorators/SettingsMenuDecorator';

import '../style.css';


const menu = [
  {
    url: 'profile',
    title: 'Profile',
    icon: 'user',
    menuItems: [
      { 
        title: 'User', 
        url: 'user' 
      }, { 
        title: 'Away mode', 
        url: 'away' 
      }, 
    ],
    advancedMenuItems: [
      { 
        title: 'Ignored users', 
        url: 'ignored-users',
        noSave: true,
      }, { 
        title: 'Miscellaneous', 
        url: 'miscellaneous' 
      },
    ],
  }, {
    url: 'connectivity',
    title: 'Connectivity',
    icon: 'signal',
    menuItems: [
      { 
        title: 'Auto detection', 
        url: 'detection', 
        noSave: true 
      },
    ],
    advancedMenuItems: [
      { 
        title: 'IPv4 connectivity (manual)', 
        url: 'v4' 
      }, {
        title: 'IPv6 connectivity (manual)', 
        url: 'v6' 
      }, { 
        title: 'Ports (manual)', 
        url: 'ports' 
      }, { 
        title: 'Proxies', 
        url: 'proxies' 
      }, { 
        title: 'Encryption', 
        url: 'encryption' 
      },
    ],
  }, {
    url: 'speed-limits',
    title: 'Speed and limits',
    icon: 'dashboard',
    menuItems: [
      { 
        title: 'Connection speed', 
        url: 'speed' 
      }, { 
        title: 'Bandwidth limiting', 
        url: 'limiter',
      },
    ],
    advancedMenuItems: [
      { 
        title: 'Download limits', 
        url: 'download-limits' 
      }, { 
        title: 'Upload limits', 
        url: 'upload-limits' 
      }, { 
        title: 'Per-user limits', 
        url: 'user-limits' 
      },
    ],
  }, {
    url: 'downloads',
    title: 'Downloads',
    icon: 'download',
    menuItems: [
      { 
        title: 'Locations', 
        url: 'locations' 
      },
    ],
    advancedMenuItems: [
      { 
        title: 'Skipping options', 
        url: 'skipping-options' 
      }, { 
        title: 'Search matching', 
        url: 'search-matching' 
      }, { 
        title: 'Download options', 
        url: 'download-options' 
      }, { 
        title: 'Priorities', 
        url: 'priorities' 
      }
    ],
  }, {
    url: 'sharing',
    title: 'Sharing',
    icon: 'tasks',
    menuItems: [
      { 
        title: 'Refresh options', 
        url: 'refresh-options' 
      }, { 
        title: 'Share profiles', 
        url: 'profiles', 
        noSave: true 
      }
    ],
    advancedMenuItems: [
      { 
        title: 'Sharing options', 
        url: 'sharing-options' 
      }, { 
        title: 'Hashing', 
        url: 'hashing' 
      }, { 
        title: 'Excluded paths', 
        url: 'excludes',
        noSave: true
      },
    ],
  }, {
    url: 'view',
    title: 'View',
    icon: 'browser',
    menuItems: [
      { 
        title: 'Notifications', 
        url: 'notifications',
        local: true,
      }, { 
        title: 'Histories', 
        url: 'histories' 
      }, { 
        title: 'Events', 
        url: 'events' 
      },
    ],
    advancedMenuItems: [
      { 
        title: 'Miscellaneous', 
        url: 'miscellaneous',
        local: true,
      },
    ],
  }, {
    url: 'about',
    title: 'About',
    icon: 'info',
    menuItems: [
      { 
        title: 'Application', 
        url: 'application' 
      }, { 
        title: 'Transfer statistics', 
        url: 'transfers',
        access: AccessConstants.TRANSFERS,
      }, { 
        title: 'Share statistics', 
        url: 'share' 
      }, { 
        title: 'Hub statistics', 
        url: 'hubs',
        access: AccessConstants.HUBS_VIEW,
      },
    ],
  }, {
    url: 'extensions',
    title: 'Extensions',
    icon: 'puzzle',
    menuItems: [
      { 
        title: 'Manage installed', 
        url: 'manage',
        noSave: true,
      }, { 
        title: 'Extension catalog', 
        url: 'packages', 
        noSave: true,
      }
    ],
    advancedMenuItems: [
      { 
        title: 'Extension options', 
        url: 'extension-options',
      },
    ],
  }, {
    url: 'system',
    title: 'System',
    icon: 'settings',
    access: AccessConstants.ADMIN,
    menuItems: [
      { 
        title: 'Users', 
        url: 'users', 
        noSave: true, 
        fullWidth: true 
      }, { 
        title: 'Logging', 
        url: 'logging',
      }, { 
        title: 'Web server', 
        url: 'server-settings',
      },
    ],
  }
];

const MainLayout = SettingsMenuDecorator(({ menuItems, children, currentMenuItem }) => {
  const child = React.cloneElement(children, {
    menuItems: currentMenuItem.menuItems,
    advancedMenuItems: currentMenuItem.advancedMenuItems,
    parent: currentMenuItem,
    parentMenuItems: menuItems,
  });

  return (
    <div className="ui segment settings-layout">
      { child }
    </div>
  );
});

// Only to pass menu items to the decorated component
class Settings extends React.Component {
  render() {
    return (
      <MainLayout { ...this.props } menuItems={ menu }/>
    );
  }
}

export default Settings;