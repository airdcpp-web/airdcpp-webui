'use strict';

import React from 'react';
import { RouteComponentProps } from 'react-router';
import { withTranslation, WithTranslation } from 'react-i18next';

import SettingsMenuDecorator from '../decorators/SettingsMenuDecorator';
import { getModuleT } from 'utils/TranslationUtils';

import * as UI from 'types/ui';

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

export interface SettingsProps extends RouteComponentProps, WithTranslation {

}

// Only to pass menu items to the decorated component
class Settings extends React.Component<SettingsProps> {
  settingsT = getModuleT(this.props.t, UI.Modules.SETTINGS);
  render() {
    return (
      <MainLayout 
        { ...this.props } 
        menuItems={ menu }
        settingsT={ this.settingsT }
      />
    );
  }
}

export default withTranslation()(Settings);