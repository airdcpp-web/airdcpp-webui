import React from 'react';
import Reflux from 'reflux';

import LoginActions from 'actions/LoginActions';
import LoginStore from 'stores/LoginStore';

import Message from 'components/semantic/Message';
import Loader from 'components/semantic/Loader';

import { History } from 'react-router';

const ErrorBox = React.createClass({
	render: function () {
		if (this.props.lastError === null) {
			return null;
		}

		return <Message isError={true} description={ 'Authentication failed: ' + this.props.lastError }/>;
	}
});

const ENTER_KEY_CODE = 13;

const Login = React.createClass({
	mixins: [ Reflux.connect(LoginStore), History ],
	getInitialState() {
		return {
			username: '',
			password: '',
			loading: false,
		};
	},

	componentWillUpdate(nextProps, nextState) {
		if (nextState.socketAuthenticated) {
			const nextPath = this.props.location.state ? this.props.location.state.nextPath : '/';
			this.history.replaceState(null, nextPath);
		} else if (this.state.loading && nextState.lastError !== null) {
			this.setState({ loading: false });
		}
	},

	_onKeyDown: function (event) {
		if (event.keyCode === ENTER_KEY_CODE) {
			this.onSubmit(event);
		}
	},

	onSubmit(evt) {
		const username = this.refs.username.value;
		const password = this.refs.password.value;
		evt.preventDefault();

		if (username === '' || password === '') {
			this.setState({ lastError: 'Please enter both username and password' });
			return;
		}

		LoginActions.login(username, password);
		this.setState({ loading: true });
	},

	render() {
		// Don't change the submit button type so that browser prompt to save the password
		return (
			<div className="ui middle aligned center aligned grid login-grid">
				<div className="column">
					<form className="ui large form" onKeyDown={this._onKeyDown} autoComplete="on">
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
							{ !this.state.loading ? (
								<input
									className="ui button fluid large submit"
									value="Login"
									type="submit"
									onClick={ this.onSubmit }
								/>
							) : <Loader className="inline small" text=""/> }
						</div>
					</form>

					<ErrorBox userLoggedIn={this.state.userLoggedIn} lastError={this.state.lastError}/>
				</div>
			</div>
		);
	}
});

export default Login;