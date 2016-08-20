import React from 'react';

import { ListItem } from 'components/semantic/List';
import LimiterConfig from 'components/LimiterConfig';
import Popup from 'components/semantic/Popup';

import ValueFormat from 'utils/ValueFormat';

import AccessConstants from 'constants/AccessConstants';
import LoginStore from 'stores/LoginStore';


const LimiterValue = ({ limit, settingKey }) => {
	const value = limit ? ValueFormat.formatSpeed(limit * 1024) : 'Disabled';
	if (!LoginStore.hasAccess(AccessConstants.SETTINGS_EDIT)) {
		return <span>{ value }</span>;
	}

	return (
		<Popup 
			triggerClassName="limit" 
			className="limiter" 
			trigger={ value }
		>
			<LimiterConfig
				limit={ limit }
				settingKey={ settingKey }
			/>
		</Popup>
	);
};


const StatColumn = ({ stats }) => (
	<div className="ui list info tiny stats">
		<ListItem header="Downloads" description={ stats.downloads }/>
		<ListItem header="Uploads" description={ stats.uploads }/>
		<div className="section-separator"/>
		<ListItem header="Downloaded" description={ ValueFormat.formatSize(stats.session_downloaded) }/>
		<ListItem header="Uploaded" description={ ValueFormat.formatSize(stats.session_uploaded) }/>
		<div className="section-separator"/>
		<ListItem header="Download limit" description={ <LimiterValue limit={ stats.limit_down } settingKey="download_limit_main"/> }/>
		<ListItem header="Upload limit" description={ <LimiterValue limit={ stats.limit_up } settingKey="upload_limit_main"/> }/>
	</div>
);

export default StatColumn;