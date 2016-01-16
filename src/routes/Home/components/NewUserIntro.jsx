import React from 'react';
import { Link } from 'react-router';
import LinkConstants from 'constants/LinkConstants';

import ActionButton from 'components/ActionButton';
import Message from 'components/semantic/Message';

import LoginActions from 'actions/LoginActions';
import LoginStore from 'stores/LoginStore';


const NewUserIntro = () => {
	if (!LoginStore.showNewUserIntro) {
		return <span/>;
	}

	return (
		<Message 
			title="Information for new user"
			description={ (
				<div className="new-user-message">
					<ul>
					<li>
						You might want to go through at least each main page of <Link to="/settings">the client settings</Link> before you start.
					</li>
					<li>
						<strong>
							It's important that you <Link to="/settings/speed-limits/speed">configure your connection speed</Link> correctly 
							because the client won't be able to utilize your bandwidth efficiently otherwise.
						</strong>
					</li>
					<li>
						There is no listing of public hubs yet so you need to know the hub addresses where you wish to connect to.
					</li>
					</ul>
					<p>
						Visit the <a href={ LinkConstants.HOME_PAGE_URL } target="_blank">home page</a> for more information about the client and its features.
					</p>
					<ActionButton 
						action={ LoginActions.newUserIntroSeen }
					/>
				</div>
			) }
		/>
	);
};

export default NewUserIntro;