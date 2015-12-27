import React from 'react';

import DownloadActions from 'actions/DownloadActions';


export default function (Component) {
	const DownloadMenu = ({ handler, parentEntity, itemInfo, location, caption, ...other }) => {
		const data = {
			parentEntity: parentEntity,
			handler: handler,
			itemInfo: itemInfo,
			location: location
		};

		return (
			<Component 
				caption={ caption } 
				actions={ DownloadActions } 
				ids={[ 'download', 'downloadTo' ]} 
				itemData={ data } 
				{ ...other }
			/>
		);
	};

	DownloadMenu.propTypes = {

		/**
		 * Possible entity to be passed to the handler (when not used for items in a singleton entity)
		 */
		parentEntity: React.PropTypes.any,

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
