import React from 'react';

import ValueFormat from 'utils/ValueFormat.js';
import { SeverityEnum } from 'constants/EventConstants';
import IconConstants from 'constants/IconConstants';


const getIcon = (severity) => {
	switch (severity) {
		case SeverityEnum.INFO: return IconConstants.INFO + ' circle';
		case SeverityEnum.WARNING: return IconConstants.WARNING;
		case SeverityEnum.ERROR: return IconConstants.ERROR;
		default: return '';
	}
};

const LogMessage = ({ message }) => {
	return (
		<div className="log-message">
			<div className="ui message-info">
				<i className={ getIcon(message.severity) + ' icon' }/>
				<div className="timestamp">{ ValueFormat.formatTimestamp(message.time) }</div>
			</div>
			<div className="message-text">
				{ message.text }
			</div>
		</div>
	);
};

export default LogMessage;