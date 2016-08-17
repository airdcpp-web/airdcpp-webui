'use strict';
import React from 'react';

import StatisticsIcons from './icon/StatisticsIcons';
import PerformanceTools from './icon/PerformanceTools';
import AwayIcon from './icon/AwayIcon';


const IconPanel = ({ leftContent, rightContent }) => (
	<div className="icon-panel">
		<StatisticsIcons/>
		<div className="touch-icons">
			<AwayIcon/>
			{ process.env.NODE_ENV !== 'production' ? <PerformanceTools/> : null }
		</div>
	</div>
);

export default IconPanel;
