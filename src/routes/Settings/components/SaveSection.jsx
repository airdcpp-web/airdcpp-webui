import React from 'react';
import Button from 'components/semantic/Button';

const SaveSection = React.createClass({
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

	render: function () {
		const title = this.props.hasChanges ? 'Save changes' : 'No unsaved changes';
		return (
			<div className="ui save-message">
				<div className="content">
					<div>
						<Button 
							caption={ title }
							icon={ "green checkmark" } 
							loading={ false } 
							disabled={ !this.props.hasChanges }
							onClick={ this.props.saveHandler }
						/>
					</div>
				</div>
			</div>
		);
	}
});

export default SaveSection;