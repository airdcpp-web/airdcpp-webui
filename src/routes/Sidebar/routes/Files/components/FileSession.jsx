'use strict';
import React from 'react';

import IconConstants from 'constants/IconConstants';
import Loader from 'components/semantic/Loader';
import Message from 'components/semantic/Message';

import LoginStore from 'stores/LoginStore';

import AudioFile from './AudioFile';
import ImageFile from './ImageFile';
import TextFile from './TextFile';
import VideoFile from './VideoFile';

import ActiveSessionDecorator from 'decorators/ActiveSessionDecorator';
import FileFooter from './FileFooter';


const getViewerElement = (item) => {
	if (item.text) {
		return TextFile;
	}

	switch (item.type.content_type) {
		case 'audio': return AudioFile;
		case 'picture': return ImageFile;
		case 'video': return VideoFile;
	}

	return null;
};

const getUrl = (tth) => {
	return getBasePath() + 'view/' + tth + '?auth=' + LoginStore.authToken; 
};

const FileSession = React.createClass({
	render() {
		const { session } = this.props;
		if (!session.content_ready) {
			if (session.download_state.id === 'download_failed') {
				return (
					<Message 
						icon={ IconConstants.ERROR }
						title="Download failed"
						description={ session.download_state.str }
					/>
				);
			}

			return <Loader text={ session.download_state.str }/>;
		}

		const ViewerElement = getViewerElement(session);

		let child;
		if (!ViewerElement) {
			child = 'Unsupported format';
		} else {
			child = (
				<ViewerElement 
					item={ session }
					url={ getUrl(session.tth) }
					type={ session.mime_type }
					extension={ session.type.str }
				/>
			);
		}

		return (
			<div className={ 'file-session ' + session.type.str + ' ' + session.type.content_type }>
				<div className="file-content">
					{ child }
				</div>
				<FileFooter item={ session }/>
			</div>
		);
	},
});

export default ActiveSessionDecorator(FileSession);
