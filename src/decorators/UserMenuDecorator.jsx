import React from 'react';

import UserActions from 'actions/UserActions';
import FileUtils from 'utils/FileUtils';
import { UserIconFormatter } from 'utils/IconFormat';

export default function (Component) {
	const UserMenu = ({ text, userIcon, directory, user, ...other }) => {
		let nicks = text;
		if (!nicks) {
			nicks = user.nicks ? user.nicks : user.nick;
		}

		let caption = nicks;
		if (userIcon) {
			caption = (
				<div className="icon-caption">
					{ userIcon === 'simple' ? <i className="blue user icon"/> : <UserIconFormatter size="large" flags={ user.flags }/> }
					{ nicks }
				</div>
			);
		}

		// There are no items at the moment that work with our own user
		if (user.flags.indexOf('me') !== -1 || user.flags.indexOf('hidden') !== -1) {
			return <span>{ caption }</span>;
		}

		const data = {
			user: user,
			directory: FileUtils.getFilePath(directory)
		};

		return (
			<Component 
				{ ...other }
				className="user-menu"
				caption={ caption } 
				actions={ UserActions } 
				itemData={ data }
			/>
		);
	};

	UserMenu.defaultProps = {
		directory: '/',
	};

	UserMenu.propTypes = {
		/**
		 * Filelist directory to use for browsing the list
		 */
		directory: React.PropTypes.string,

		/**
		 * Hinted user
		 */
		user: React.PropTypes.shape({
			cid: React.PropTypes.string,
			hub_url: React.PropTypes.string
		}).isRequired,

		/**
		 * Router location
		 */
		location: React.PropTypes.object.isRequired,

		/**
		 * No icon is added by default
		 * Set the 'simple' to use a single color icon for all users
		 */
		userIcon: React.PropTypes.bool,

		/**
		 * Optional custom caption to use
		 */
		text : React.PropTypes.node,
	};

	return UserMenu;
}
