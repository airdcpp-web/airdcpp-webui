import React, { findDOMNode } from 'react';
import Reflux from 'reflux';
import LoginActions from 'actions/LoginActions';
import LoginStore from 'stores/LoginStore';

import ErrorMessage from './semantic/ErrorMessage';
import { History } from 'react-router';

const ErrorBox = React.createClass({
	render: function () {
		if (this.props.lastError === null) {
			return null;
		}

		return <ErrorMessage description={ 'Authentication failed: ' + this.props.lastError }/>;
	}
});

const ENTER_KEY_CODE = 13;

export default React.createClass({
	mixins: [ Reflux.connect(LoginStore), History ],
	getInitialState() {
		return {
			username: '',
			password: ''
		};
	},

	componentWillUpdate(nextProps, nextState) {
		if (nextState.socketAuthenticated) {
			const nextPath = this.props.location.state ? this.props.location.state.nextPath : '/';
			this.history.replaceState(null, nextPath);
		}
	},

	_onKeyDown: function (event) {
		if (event.keyCode === ENTER_KEY_CODE) {
			this.onSubmit(event);
		}
	},

	onSubmit(evt) {
		const username = findDOMNode(this.refs.username).value;
		const password = findDOMNode(this.refs.password).value;
		evt.preventDefault();

		if (username === '' || password === '') {
			this.setState({ lastError: 'Please enter both username and password' });
			return;
		}

		LoginActions.login(username, password);
	},

	render() {
		return (
		<div className="ui middle aligned center aligned grid login-grid">
			<div className="column">
				<form className="ui large form" onKeyDown={this._onKeyDown}>
					<div className="ui stacked segment">
						<div className="field">
							<div className="ui left icon input">
								<i className="user icon"></i>
								<input type="text" name="username" placeholder="Username" ref="username"/>
							</div>
						</div>
						<div className="field">
							<div className="ui left icon input">
								<i className="lock icon"></i>
								<input className="password" name="password" placeholder="Password" ref="password" type="password"/>
							</div>
						</div>
						<div className="ui fluid large submit button" type="submit" onClick={this.onSubmit}>Login</div>
					</div>
				</form>

				<ErrorBox userLoggedIn={this.state.userLoggedIn} lastError={this.state.lastError}/>
			</div>
		</div>);
	}
});
