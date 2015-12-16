import React from 'react';

import ActionInput from 'components/semantic/ActionInput';
import Button from 'components/semantic/Button';

import HubActions from 'actions/HubActions';


const HubActionPrompt = ({ icon, title, content }) => (
	<div className="ui icon message hub-action-prompt">
		<h3 className="ui header">
			<i className={ icon + ' icon'}></i>
			<div className="content">
				{ title }
			</div>
		</h3>
		{ content }
	</div>
);

HubActionPrompt.propTypes = {
	/**
	 * Message title
	 */
	title: React.PropTypes.node.isRequired,

	/**
	 * Children
	 */
	content: React.PropTypes.node.isRequired,
};

const PasswordPrompt = ({ hub }) => (
	<div>
		<ActionInput 
			placeholder="Password" 
			caption="Submit" 
			icon="green play" 
			handleAction={ text => HubActions.password(hub, text) }
		/>
		<p>This usually means that there's a registered account associated with your nick. If you don't remember having a registered account in this hub, there may be someone else using the same nick.</p>
	</div>
);

const RedirectPrompt = ({ hub }) => (
	<Button
		icon="green play"
		onClick={ _ => HubActions.redirect(hub) }
		caption={ 'Accept redirect to ' + hub.connect_state.hub_url }
	/>
);

export { RedirectPrompt, PasswordPrompt, HubActionPrompt };