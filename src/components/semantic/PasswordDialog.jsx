import React from 'react';
import BlueBird from 'bluebird';

import ConfirmDialog from 'components/semantic/ConfirmDialog';

const PasswordField = React.createClass({
	propTypes: {
		/**
		 * Action description
		 */
		text: React.PropTypes.node.isRequired,

		/**
		 * Handler for input changes
		 */
		onChange: React.PropTypes.func.isRequired,
	},

	displayName: 'PasswordField',
	render: function () {
		return (
			<div className="ui input password-dialog">
				{this.props.text}
				<input type="password" placeholder="Enter password" onChange={this.props.onChange}/>
			</div>
		);
	}
});

export default function (title, text) {
	let password = '';
	let resolver = BlueBird.pending();

	const input = <PasswordField text={text} onChange={(event) => password = event.target.value }/>;

	ConfirmDialog(title, input, 'yellow lock', 'Set password', 'Cancel')
		.then(() => resolver.resolve(password))
		.catch(() => {});

	return resolver.promise;
}
