'use strict';
import React from 'react';

import Loader from 'components/semantic/Loader';

import ImageFile from './ImageFile';
import TextFile from './TextFile';
import FileFooter from './FileFooter';

const FileSession = React.createClass({
	render() {
		const { item } = this.props;
		if (item.state.id !== 'downloaded') {
			return <Loader text={ item.state.str }/>;
		}

		return (
			<div className={ 'file-session ' + item.type.str + ' ' + item.type.content_type }>
				<div className="file-content">
					{ item.text ? (
						<TextFile text={ this.state.text }/>
					) : (
						<ImageFile item={ item }/>
					) }
				</div>
				<FileFooter item={ item }/>
			</div>
		);
	},
});

export default FileSession;
