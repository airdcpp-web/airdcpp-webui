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
	return getBasePath() + 'view/' + tth + '?auth=' + LoginStore.token; 
};

const FileSession = React.createClass({
	render() {
		const { item } = this.props;
		if (item.state.id !== 'downloaded') {
			if (item.state.id === 'download_failed') {
				return (
					<Message 
						icon={ IconConstants.ERROR }
						title="Download failed"
						description={ item.state.str }
					/>
				);
			}

			return <Loader text={ item.state.str }/>;
		}

		const ViewerElement = getViewerElement(item);

		let child;
		if (!ViewerElement) {
			child = 'Unsupported format';
		} else {
			child = (
				<ViewerElement 
					item={ item }
					url={ getUrl(item.tth) }
					type={ item.mime_type }
					extension={ item.type.str }
				/>
			);
		}

		return (
			<div className={ 'file-session ' + item.type.str + ' ' + item.type.content_type }>
				<div className="file-content">
					{ child }
				</div>
				<FileFooter item={ item }/>
			</div>
		);
	},
});

export default FileSession;
