import React from 'react';
import Modal from 'components/semantic/Modal';

import QueueConstants from 'constants/QueueConstants';

import SocketService from 'services/SocketService';
import { LocationContext, RouteContext } from 'mixins/RouterMixin';

import { FileIcon } from 'utils/IconFormat';
import IconConstants from 'constants/IconConstants';

import Loader from 'components/semantic/Loader';
import Message from 'components/semantic/Message';

import SourceTable from './SourceTable';


const SourceDialog = React.createClass({
	mixins: [ LocationContext, RouteContext ],

	getInitialState() {
		return {
			sources: [],
			error: null,
		};
	},

	componentDidMount() {
		this.fetchSources();
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

	onRemoveFailed(error) {
		
	},

	handleRemove(source) {
		SocketService.delete(QueueConstants.BUNDLE_URL + '/' + this.props.bundle.id + '/source/' + source.user.cid)
			.then(this.fetchSources)
			.catch(this.onRemoveFailed);
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
							handleRemove={ this.handleRemove }
						/>
					)
				}
			</Modal>
		);
	}
});

export default SourceDialog;