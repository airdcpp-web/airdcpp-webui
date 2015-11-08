import React from 'react';

import UserActions from 'actions/UserActions';
import FileUtils from 'utils/FileUtils';

export default function (Component) {
	const UserMenu = React.createClass({
		propTypes: {

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

			userIcon: React.PropTypes.bool,

			/**
			 * Optional custom caption to use
			 */
			text : React.PropTypes.node,
		},

		getDefaultProps() {
			return {
				directory: '/'
			};
		},

		render: function () {
			const { text, userIcon, directory, user, ...other } = this.props;
			const data = {
				user: user,
				directory: FileUtils.getFilePath(directory)
			};

			let nicks = text;
			if (!nicks) {
				nicks = user.nicks ? user.nicks : user.nick;
			}
			const caption = (userIcon ? 
				<div>
					<i className="blue user icon"/>
					{ nicks }
				</div>
			 : nicks);

			return <Component caption={ caption } actions={ UserActions } itemData={ data } { ...other }/>;
		}
	});

	return UserMenu;
}
