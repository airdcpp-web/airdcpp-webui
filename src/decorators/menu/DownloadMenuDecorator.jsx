import React from 'react';

import DownloadActions from 'actions/DownloadActions';


export default function (Component) {
	const DownloadMenu = ({ handler, user, itemInfo, location, caption, ...other }) => {
		const data = {
			user,
			handler,
			itemInfo,
			location
		};

		const isDirectory = itemInfo.type.id === 'directory';
		const ids = [ 'download', 'downloadTo' ];

		if (itemInfo.type.content_type === 'picture') {
			ids.push('viewImage');
		} else if (!isDirectory && itemInfo.size < 256*1024) {
			ids.push('viewText');
		}

		if (isDirectory) {
			ids.push('findNfo');
		}

		return (
			<Component 
				caption={ caption } 
				actions={ DownloadActions } 
				ids={ ids } 
				itemData={ data } 
				{ ...other }
			/>
		);
	};

	DownloadMenu.propTypes = {

		/**
		 * Possible user to be passed to the handler (when not used for items in a singleton entity)
		 */
		user: React.PropTypes.object.isRequired,

		/**
		 * Function for handling the download
		 */
		handler: React.PropTypes.func.isRequired,

		/**
		 * Additional data to be passed to the handler
		 */
		itemInfo: React.PropTypes.any,

		/**
		 * Location from component props
		 */
		location: React.PropTypes.object.isRequired
	};


	return DownloadMenu;
}
