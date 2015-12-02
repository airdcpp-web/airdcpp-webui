import React from 'react';
import BlueBird from 'bluebird';

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

const InputDialog = function (dialogOptions, inputOptions) {
	let inputText = inputOptions.defaultValue ? inputOptions.defaultValue : '';
	let resolver = BlueBird.pending();

	const input = <InputField { ...inputOptions } content={ dialogOptions.content } onChange={(event) => inputText = event.target.value }/>;

	ConfirmDialog(Object.assign(dialogOptions, {
		rejectCaption: 'Cancel',
		content: input,
	}))
		.then(() => resolver.resolve(inputText))
		.catch(() => {});

	return resolver.promise;
};

export const PasswordDialog = function (title, text) {
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

	return InputDialog(dialogOptions, inputOptions);
};

export default InputDialog;