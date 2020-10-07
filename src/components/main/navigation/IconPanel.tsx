'use strict';
import React from 'react';

import StatisticsIcons from 'components/main/navigation/icon/StatisticsIcons';
//import PerformanceTools from './icon/PerformanceTools';
import AwayIcon from 'components/main/navigation/icon/AwayIcon';
import RefreshProgress from './icon/RefreshProgress';
import HashProgress from './icon/HashProgress';


const IconPanel: React.FC = () => (
  <div className="icon-panel">
    <StatisticsIcons/>
    <div className="touch-icons">
      <AwayIcon/>
      <HashProgress/>
      <RefreshProgress/>
    </div>
  </div>
);

export default IconPanel;
