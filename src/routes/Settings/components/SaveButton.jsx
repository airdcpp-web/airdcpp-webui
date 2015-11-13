import React from 'react';
import Button from 'components/semantic/Button';

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

	onClick() {
		this.setState({ saving: true });
		this.props.saveHandler().finally(() => this.setState({ saving: false }));
	},

	render: function () {
		const title = this.props.hasChanges ? 'Save changes' : 'No unsaved changes';
		return (
			<Button 
				caption={ title }
				icon={ (this.props.hasChanges ? 'green checkmark' : null) } 
				loading={ this.state.saving } 
				disabled={ !this.props.hasChanges }
				onClick={ this.onClick }
			/>
		);
	}
});

export default SaveButton;