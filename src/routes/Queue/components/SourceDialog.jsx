import React from 'react';
import Modal from 'components/semantic/Modal';

import QueueConstants from 'constants/QueueConstants';

import SocketService from 'services/SocketService';
import { LocationContext, RouteContext } from 'mixins/RouterMixin';
import SocketSubscriptionMixin from 'mixins/SocketSubscriptionMixin';

import FileIcon from 'components/icon/FileIcon';
import IconConstants from 'constants/IconConstants';

import Loader from 'components/semantic/Loader';
import Message from 'components/semantic/Message';

import SourceTable from './SourceTable';


const SourceDialog = React.createClass({
	mixins: [ LocationContext, RouteContext, SocketSubscriptionMixin() ],

	getInitialState() {
		return {
			sources: [],
			error: null,
		};
	},

	componentDidMount() {
		this.fetchSources();
	},

	onSocketConnected(addSocketListener) {
		addSocketListener(QueueConstants.MODULE_URL, QueueConstants.BUNDLE_SOURCES, this.onSourcesUpdated);
	},

	onSourcesUpdated(bundle) {
		if (bundle.id === this.props.bundle.id) {
			this.fetchSources();
		}
	},

	onSourcesReceived(data) {
		this.setState({
			sources: data,
		});
	},

	onSourcesFailed(error) {
		this.setState({
			error
		});
	},

	fetchSources() {
		SocketService.get(QueueConstants.BUNDLE_URL + '/' + this.props.bundle.id + '/sources')
			.then(this.onSourcesReceived)
			.catch(this.onSourcesFailed);
	},

	render: function () {
		if (!this.state.sources) {
			return <Loader/>;
		}

		const { bundle } = this.props;
		return (
			<Modal 
				className="source" 
				title={ bundle.name }
				closable={ true } 
				icon={ <FileIcon typeInfo={ bundle.type }/> } 
				fullHeight={ true }
				{...this.props}
			>
				{ this.state.error ? (
						<Message 
							title="Failed to load source listing"
							icon={ IconConstants.ERROR }
							description={ this.state.error.message }
						/>
					) : (
						<SourceTable 
							sources={ this.state.sources }
							bundle={ bundle }
						/>
					)
				}
			</Modal>
		);
	}
});

export default SourceDialog;