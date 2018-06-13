'use strict';

import React from 'react';

import SettingsMenuDecorator, { SettingsMenuDecoratorProps } from '../decorators/SettingsMenuDecorator';

import '../style.css';


const menu = [
  require('../routes/Profile'),
  require('../routes/Connectivity'),
  require('../routes/SpeedLimits'),
  require('../routes/Downloads'),
  require('../routes/Sharing'),
  require('../routes/View'),
  require('../routes/About'),
  require('../routes/Extensions'),
  require('../routes/System'),
];

const MainLayout = SettingsMenuDecorator(({ children }) => {
  return (
    <div className="ui segment settings-layout">
      { children }
    </div>
  );
});

export interface SettingsProps extends SettingsMenuDecoratorProps {

}

// Only to pass menu items to the decorated component
class Settings extends React.Component<SettingsProps> {
  render() {
    return (
      <MainLayout 
        { ...this.props } 
        menuItems={ menu }
      />
    );
  }
}

export default Settings;