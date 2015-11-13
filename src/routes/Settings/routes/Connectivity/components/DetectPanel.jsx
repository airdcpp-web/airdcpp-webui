import React from 'react';
import SocketService from 'services/SocketService';
import SocketSubscriptionMixin from 'mixins/SocketSubscriptionMixin';

import Button from 'components/semantic/Button';

import { CONNECTIVITY_MODULE_URL, CONNECTIVITY_STATUS_URL, CONNECTIVITY_DETECT_URL, CONNECTIVITY_STARTED, CONNECTIVITY_FINISHED } from 'constants/ConnectivityConstants';

const StatusRow = ({ title, status }) => (
	<div className="ui row">
		<div className="four wide column">
			<div className="ui tiny header">
			{ title }
			</div>
		</div>
		<div className="ten wide column">
			{ status === '' ? 'Auto detection not enabled' : status }
		</div>
	</div>
);

const DetectPanel = React.createClass({
	mixins: [ SocketSubscriptionMixin ],
	onSocketConnected(addSocketListener) {
		addSocketListener(CONNECTIVITY_MODULE_URL, CONNECTIVITY_STARTED, this.onDetectStarted);
		addSocketListener(CONNECTIVITY_MODULE_URL, CONNECTIVITY_FINISHED, this.onDetectFinished);
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
	},

	setProtocolDetectState(v6, enabled) {
		const value = 'detecting' + (v6 ? 'V6' : 'V4');
		this.setState({ [value]: enabled });
	},

	updateStatus() {
		SocketService.get(CONNECTIVITY_STATUS_URL)
			.then(this.onStatusReceived)
			.catch(error => 
				console.error('Failed to get status: ' + error)
			);
	},

	handleDetect() {
		SocketService.post(CONNECTIVITY_DETECT_URL)
			.then(this.onSettingsReceived)
			.catch(error => 
				console.error('Failed to start detection: ' + error)
			);
	},

	render() {
		const { status } = this.state;
		if (!status) {
			return null;
		}

		return (
			<div className="ui segment detect-panel">
				<Button 
					caption="Detect"
					icon={ "gray configure" } 
					loading={ this.state.detectingV6 || this.state.detectingV4 } 
					onClick={this.handleDetect}
				/>
				<div className="ui grid two column detect-grid">
					<StatusRow title="IPv4 detection status" status={status.status_v4}/>
					<StatusRow title="IPv6 detection status" status={status.status_v6}/>
				</div>
			</div>
		);
	}
});

export default DetectPanel;