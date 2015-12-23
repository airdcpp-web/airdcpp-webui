import React from 'react';
import Button from 'components/semantic/Button';

import AccessConstants from 'constants/AccessConstants';
import LoginStore from 'stores/LoginStore';


const SaveButton = React.createClass({
	propTypes: {
		/**
		 * Message title
		 */
		hasChanges: React.PropTypes.bool.isRequired,

		/**
		 * Error details
		 */
		saveHandler: React.PropTypes.func.isRequired,
	},

	getInitialState() {
		return {
			saving: false
		};
	},

	toggleSaveState() {
		this.setState({ saving: !this.state.saving });
	},

	onClick() {
		this.toggleSaveState();
		this.props.saveHandler()
			.then(this.toggleSaveState)
			.catch(this.toggleSaveState);
	},

	render: function () {
		let title;
		let hasAccess = LoginStore.hasAccess(AccessConstants.SETTINGS_EDIT);
		if (!hasAccess) {
			title = 'No save permission';
		} else {
			title = this.props.hasChanges ? 'Save changes' : 'No unsaved changes';
		}

		return (
			<Button 
				className={ 'save ' + this.props.className }
				caption={ title }
				icon={ (hasAccess && this.props.hasChanges ? 'green checkmark' : null) } 
				loading={ this.state.saving } 
				disabled={ !this.props.hasChanges || !hasAccess }
				onClick={ this.onClick }
			/>
		);
	}
});

export default SaveButton;