import React from 'react';

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
						You might want to go through at least each main page of <a href="/settings">the client settings</a> before you start.
					</li>
					<li>
						<strong>
							It's important that you <a href="/settings/speed-limits/speed">configure your connection speed</a> correctly 
							because the client won't be able to utilize your bandwidth efficiently otherwise.
						</strong>
					</li>
					<li>
						There is no listing of public hubs yet so you need to know the hub addresses where you wish to connect to.
					</li>
					</ul>
					<p>
						Visit the <a href="https://github.com/maksis/airdcpp-webclient" target="_blank">home page</a> for more information about the client and its features.
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