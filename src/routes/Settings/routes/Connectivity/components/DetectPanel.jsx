import React from 'react';
import SocketService from 'services/SocketService';
import SocketSubscriptionMixin from 'mixins/SocketSubscriptionMixin';

import Button from 'components/semantic/Button';
import Loader from 'components/semantic/Loader';

import ConnectivityConstants from 'constants/ConnectivityConstants';
import AccessConstants from 'constants/AccessConstants';
import LoginStore from 'stores/LoginStore';

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

const DetectPanel = React.createClass({
	mixins: [ SocketSubscriptionMixin() ],
	onSocketConnected(addSocketListener) {
		const url = ConnectivityConstants.MODULE_URL;
		addSocketListener(url, ConnectivityConstants.CONNECTIVITY_STARTED, this.onDetectStarted);
		addSocketListener(url, ConnectivityConstants.CONNECTIVITY_FINISHED, this.onDetectFinished);
	},

	getInitialState() {
		return {
			status: null
		};
	},

	componentDidMount() {
		this.updateStatus();
	},

	onStatusReceived(data) {
		this.setState({ status: data });
	},

	onDetectStarted(data) {
		this.setProtocolDetectState(data.v6, true);
	},

	onDetectFinished(data) {
		this.setProtocolDetectState(data.v6, false);
		this.updateStatus();
	},

	setProtocolDetectState(v6, enabled) {
		const value = 'detecting' + (v6 ? 'V6' : 'V4');
		this.setState({ [value]: enabled });
	},

	updateStatus() {
		SocketService.get(ConnectivityConstants.STATUS_URL)
			.then(this.onStatusReceived)
			.catch(error => 
				console.error('Failed to get status: ' + error)
			);
	},

	handleDetect() {
		SocketService.post(ConnectivityConstants.DETECT_URL)
			.then(this.onSettingsReceived)
			.catch(error => 
				console.error('Failed to start detection: ' + error)
			);
	},

	render() {
		const { status } = this.state;
		if (!status) {
			return <Loader text="Loading detection status"/>;
		}

		return (
			<div className="ui segment detect-panel">
				<h3 className="header">Current auto detection status</h3>
				<div className="ui grid two column">
					<StatusRow title="IPv4 connectivity" status={status.status_v4} running={this.state.detectingV4}/>
					<StatusRow title="IPv6 connectivity" status={status.status_v6} running={this.state.detectingV6}/>
				</div>
				{ LoginStore.hasAccess(AccessConstants.SETTINGS_EDIT) ? (
					<Button 
						className="detect-button"
						caption="Detect now"
						icon="gray configure"
						disabled={ !status.status_v4.auto_detect && !status.status_v6.auto_detect }
						loading={ this.state.detectingV6 || this.state.detectingV4 } 
						onClick={this.handleDetect}
					/> ) : null }
			</div>
		);
	}
});

export default DetectPanel;