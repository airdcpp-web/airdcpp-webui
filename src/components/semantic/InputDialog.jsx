import React from 'react';

import ConfirmDialog from 'components/semantic/ConfirmDialog';

const InputField = React.createClass({
	propTypes: {
		/**
		 * Action description
		 */
		content: React.PropTypes.node.isRequired,
	},

	render: function () {
		const { content, ...other } = this.props;
		return (
			<div className="ui input dialog">
				{content}
				<input { ...other}/>
			</div>
		);
	}
});

const InputDialog = function (dialogOptions, inputOptions, onApproved) {
	let inputText = inputOptions.defaultValue ? inputOptions.defaultValue : '';

	const input = (
		<InputField 
			{ ...inputOptions } 
			content={ dialogOptions.content } 
			onChange={(event) => inputText = event.target.value }
		/>
	);

	ConfirmDialog({
		...dialogOptions,
		rejectCaption: 'Cancel',
		content: input,
	}, () => onApproved(inputText));
};

export const PasswordDialog = function (title, text, onApproved) {
	const dialogOptions = {
		icon: 'yellow lock',
		approveCaption: 'Set password',
		content: text,
		title: title,
	};

	const inputOptions = {
		placeholder: 'Enter password',
		type: 'password',
	};

	InputDialog(dialogOptions, inputOptions, onApproved);
};

export default InputDialog;