'use strict';
import React from 'react';

import RedrawDecorator from 'decorators/RedrawDecorator';
import ValueFormat from 'utils/ValueFormat';
import { FooterItem, SessionFooter } from 'routes/Sidebar/components/SessionFooter';
import BrowserUtils from 'utils/BrowserUtils';


const FileFooter = ({ item }) => {
	if (BrowserUtils.useMobileLayout()) {
		return <span/>;
	}

	return (
		<SessionFooter>
			<FooterItem label="Downloaded" text={ ValueFormat.formatRelativeTime(item.time_finished) }/>
		</SessionFooter>
	);
};

export default RedrawDecorator(FileFooter);