import React from 'react';

import ActionButton from 'components/ActionButton';
import DataProviderDecorator from 'decorators/DataProviderDecorator';

import ConnectivityActions from 'actions/ConnectivityActions';
import ConnectivityConstants from 'constants/ConnectivityConstants';

import '../style.css';


const formatStatus = (status) => {
	let ret = status.text;
	if (status.auto_detect) {
		ret += ' (auto detected)';
	} else {
		ret += ' (manual configuration)';
	}

	return ret;
};

const StatusRow = ({ title, status, running, detect }) => (
	<div className="ui row">
		<div className="five wide column header">
			<div className="ui tiny header">
			{ title }
			</div>
		</div>
		<div className="eleven wide column">
			{ (running ? 'Detecting...' : formatStatus(status)) }
		</div>
	</div>
);

const DetectPanel = ({ status, runningV4, runningV6 }) => (
	<div className="ui segment detect-panel">
		<h3 className="header">Current auto detection status</h3>
		<div className="ui grid two column">
			<StatusRow title="IPv4 connectivity" status={ status.status_v4 } running={ runningV4 }/>
			<StatusRow title="IPv6 connectivity" status={ status.status_v6 } running={ runningV6 }/>
		</div>
		<ActionButton 
			className="detect-button"
			action={ ConnectivityActions.detect }
			disabled={ !status.status_v4.auto_detect && !status.status_v6.auto_detect }
			loading={ runningV6 || runningV4 } 
		/>
	</div>
);

export default DataProviderDecorator(DetectPanel, {
	urls: {
		status: ConnectivityConstants.STATUS_URL,
	},
	onSocketConnected: (addSocketListener, { refetchData, mergeData }) => {
		const setDetectState = (v6, running) => {
			const value = 'running' + (v6 ? 'V6' : 'V4');
			mergeData({ 
				[value]: running,
			});
		};

		addSocketListener(ConnectivityConstants.MODULE_URL, ConnectivityConstants.CONNECTIVITY_STARTED, data => {
			setDetectState(data.v6, true);
		});

		addSocketListener(ConnectivityConstants.MODULE_URL, ConnectivityConstants.CONNECTIVITY_FINISHED, data => {
			setDetectState(data.v6, false);
			refetchData();
		});
	},
});