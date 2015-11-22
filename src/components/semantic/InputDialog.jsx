import React from 'react';
import BlueBird from 'bluebird';

import ConfirmDialog from 'components/semantic/ConfirmDialog';

const InputField = React.createClass({
	propTypes: {
		/**
		 * Action description
		 */
		text: React.PropTypes.node.isRequired,

		/**
		 * Handler for input changes
		 */
		//onChange: React.PropTypes.func.isRequired,

		//inputPrompt: React.PropTypes.string,
		//type: React.PropTypes.string,
	},

	render: function () {
		const { text, ...other } = this.props;
		return (
			<div className="ui input dialog">
				{text}
				<input { ...other}/>
			</div>
		);
	}
});

const InputDialog = function (options) {
	let inputText = '';
	let resolver = BlueBird.pending();

	const { title, icon, approveCaption, ...other } = options;

	const input = <InputField { ...other } onChange={(event) => inputText = event.target.value }/>;

	ConfirmDialog(title, input, icon, approveCaption, 'Cancel')
		.then(() => resolver.resolve(inputText))
		.catch(() => {});

	return resolver.promise;
};

export const PasswordDialog = function (title, text) {
	const options = {
		icon: 'yellow lock',
		approveCaption: 'Set password',
		text: text,
		title: title,
		placeholder: 'Enter password',
		type: 'password',
	};

	return InputDialog(options);
};

export default InputDialog;