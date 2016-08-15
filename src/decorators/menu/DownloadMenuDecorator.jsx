import React from 'react';

import classNames from 'classnames';
import DownloadableItemActions from 'actions/DownloadableItemActions';


export default function (Component) {
	const DownloadMenu = ({ handler, user, itemInfo, caption, className, ...other }) => {
		const data = {
			user,
			handler,
			itemInfo,
		};
		
		return (
			<Component 
				className={ classNames('download', className) }
				caption={ caption } 
				actions={ DownloadableItemActions }
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
	};


	return DownloadMenu;
}
