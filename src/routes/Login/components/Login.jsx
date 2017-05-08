import PropTypes from 'prop-types';
import React from 'react';
import Reflux from 'reflux';

import LoginActions from 'actions/LoginActions';
import LoginStore from 'stores/LoginStore';

import Message from 'components/semantic/Message';
import Loader from 'components/semantic/Loader';

import '../style.css';


const ErrorBox = ({ lastError }) => {
	if (lastError === null) {
		return null;
	}

	return (
		<Message 
			isError={true} 
			description={ 'Authentication failed: ' + lastError }
		/>
	);
};

const SubmitButton = ({ onSubmit, loading, allowLogin }) => {
	if (!allowLogin) {
		return null;
	}

	if (loading) {
		return <Loader size="small" inline={ true } text=""/>;
	}

	// Don't change the submit button type so that browser prompt to save the password
	return (
		<input
			className="ui button fluid large submit"
			value="Login"
			type="submit"
			onClick={ onSubmit }
		/>
	);
};

const BottomMessage = () => {
	if (process.env.DEMO_MODE !== '1') {
		return null;
	}

	return (
		<div className="ui stacked segment">
			<Message 
				description={ (
					<div>
						Username: <strong>demo</strong>
						<br/>
						Password: <strong>demo</strong>
					</div> 
				)}
			/>
		</div>
	);
};

const ENTER_KEY_CODE = 13;

const Login = React.createClass({
	mixins: [ Reflux.connect(LoginStore, 'login') ],
	contextTypes: {
		router: PropTypes.object
	},

	getInitialState() {
		return {
			loading: false,
		};
	},

	componentWillUpdate(nextProps, nextState) {
		if (nextState.login.socketAuthenticated) {
			const nextPath = this.props.location.state ? this.props.location.state.nextPath : '/';
			this.context.router.replace({
				pathname: nextPath,
			});
		} else if (this.state.loading && nextState.login.lastError !== null) {
			this.setState({ loading: false });
		}
	},

	_onKeyDown: function (event) {
		if (event.keyCode === ENTER_KEY_CODE) {
			this.onSubmit(event);
		}
	},

	onSubmit(evt) {
		const username = this.username.value;
		const password = this.password.value;
		evt.preventDefault();

		if (username === '' || password === '') {
			return;
		}

		LoginActions.login(username, password);
		this.setState({ loading: true });
	},

	render() {
		return (
			<div className="ui middle aligned center aligned grid login-grid">
				<div className="column">
					<form className="ui large form" onKeyDown={this._onKeyDown} autoComplete="on">
						<div className="ui stacked segment">
							<div className="field">
								<div className="ui left icon input">
									<i className="user icon"/>
									<input type="text" name="username" placeholder="Username" ref={ c => this.username = c } autoFocus={ true }/>
								</div>
							</div>
							<div className="field">
								<div className="ui left icon input">
									<i className="lock icon"/>
									<input className="password" name="password" placeholder="Password" ref={ c => this.password = c } type="password"/>
								</div>
							</div>

							<SubmitButton
								onSubmit={ this.onSubmit }
								loading={ this.state.loading }
								allowLogin={ LoginStore.allowLogin }
							/>
						</div>

						<BottomMessage/>
					</form>

					<ErrorBox 
						userLoggedIn={ LoginStore.hasSession } 
						lastError={ LoginStore.lastError }
					/>
				</div>
			</div>
		);
	}
});

export default Login;