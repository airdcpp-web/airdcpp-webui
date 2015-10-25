import React from 'react';

import UserActions from 'actions/UserActions'
import FileUtils from 'utils/FileUtils'

export default function(Component) {
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
		},

		getDefaultProps() {
			return {
				directory: '/'
			}
		},

		render: function() {
			const { directory, user } = this.props;
			const data = {
				user: user,
				directory: FileUtils.getFilePath(directory)
			}

			const caption = (
				<div>
					<i className="blue user"/>
					{ user.nicks }
				</div>);

			return <Component location={this.props.location} caption={ caption } actions={ UserActions } itemData={ data }/>;
		}
	});

	return UserMenu;
}