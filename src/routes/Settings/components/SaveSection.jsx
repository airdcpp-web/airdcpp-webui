import React from 'react';
import classNames from 'classnames';

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
		const buttonStyle = classNames(
			'ui button',
			{ 'disabled': !this.props.hasChanges }
		);
		
		return (
			<div className="ui save-message">
				<div className="content">
					<div>
						<div className={buttonStyle} onClick={this.props.saveHandler}>
							<i className="green checkmark icon"></i>
							{title}
						</div>
					</div>
				</div>
			</div>
		);
	}
});

export default SaveSection;