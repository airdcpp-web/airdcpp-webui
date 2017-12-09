'use strict';

import React from 'react';

import SettingsMenuDecorator from '../decorators/SettingsMenuDecorator';

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

const MainLayout = SettingsMenuDecorator(({ menuItems, currentMenuItem, children, ...other }) => {
  return (
    <div className="ui segment settings-layout">
      { children }
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