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
				{ content }
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

		// A hack to cheat browser not to use autofill for the real password field
		// (some browsers can be really desperate with finding login forms...)
		// https://github.com/airdcpp-web/airdcpp-webclient/issues/100
		content: (
			<div>
				<input style={{ display: 'none' }}/>
				<input type="password" style={{ display: 'none' }}/>
				{ text }
			</div>
		),
		title: title,
	};

	const inputOptions = {
		placeholder: 'Enter password',
		type: 'password',
	};

	InputDialog(dialogOptions, inputOptions, onApproved);
};

export default InputDialog;