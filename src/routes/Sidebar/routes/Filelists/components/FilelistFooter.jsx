'use strict';
import React from 'react';

import ValueFormat from 'utils/ValueFormat';
import { FooterItem, SessionFooter } from 'routes/Sidebar/components/SessionFooter';
import BrowserUtils from 'utils/BrowserUtils';


const FilelistFooter = ({ item }) => {
	if (BrowserUtils.useMobileLayout()) {
		return null;
	}

	let locationText = item.location.type.str;
	if (locationText.length > 0) {
		locationText = ValueFormat.formatSize(item.location.size) + ' (' + locationText + ')';
	}

	return (
		<SessionFooter>
			<FooterItem label="Directory size" text={ locationText }/>
			<FooterItem label="Total list size" text={ ValueFormat.formatSize(item.total_size) }/>
		</SessionFooter>
	);
};

export default FilelistFooter;