import PropTypes from 'prop-types';
import React from 'react';
import Button from 'components/semantic/Button';

import AccessConstants from 'constants/AccessConstants';
import LoginStore from 'stores/LoginStore';


const SaveButton = React.createClass({
	propTypes: {
		/**
		 * Message title
		 */
		hasChanges: PropTypes.bool.isRequired,

		/**
		 * Error details
		 */
		saveHandler: PropTypes.func.isRequired,

		local: PropTypes.bool,
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
		const { local, hasChanges, className } = this.props;

		const hasAccess = local || LoginStore.hasAccess(AccessConstants.SETTINGS_EDIT);

		let title;
		if (!hasAccess) {
			title = 'No save permission';
		} else {
			title = hasChanges ? 'Save changes' : 'No unsaved changes';
		}

		return (
			<Button 
				className={ 'save ' + className }
				caption={ title }
				icon={ (hasAccess && hasChanges ? 'green checkmark' : null) } 
				loading={ this.state.saving } 
				disabled={ !hasChanges || !hasAccess }
				onClick={ this.onClick }
			/>
		);
	}
});

export default SaveButton;