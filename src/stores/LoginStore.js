import Reflux from 'reflux';

import StorageMixin from 'mixins/StorageMixin';

import LoginActions from 'actions/LoginActions';
import SocketActions from 'actions/SocketActions';

import AccessConstants from 'constants/AccessConstants';
import LoginConstants from 'constants/LoginConstants';


const LoginStore = Reflux.createStore({
	listenables: LoginActions,
	mixins: [ StorageMixin ],
	init: function () {
		this.loginProperties = this.loadProperty('login_properties', {});

		this._lastError = null;
		this._socketAuthenticated = false;

		this.listenTo(SocketActions.state.disconnected, this.onSocketDisconnected);
		this.getInitialState = this.getState;
	},

	onLogin(res) {
		this.reset();
	},

	getState() {
		return {
			lastError: this._lastError,
			socketAuthenticated: this._socketAuthenticated,

			token: this.token,
			user: this.user,
			userLoggedIn: this.isLoggedIn,
			awayIdleTime: this.awayIdleTime,
		};
	},

	onLoginCompleted(res) {
		this._lastError = null;
		this._socketAuthenticated = true;

		this.setLoginProperties(res);
		this.trigger(this.getState());
	},

	setLoginProperties(props) {
		this.loginProperties = props;
		this.saveProperty('login_properties', props);
	},

	// Invalid password etc.
	onLoginFailed(error) {
		this._lastError = error.message ? error.message : error;
		this.trigger(this.getState());
	},

	onNewUserIntroSeen() {
		const newProps = Object.assign({}, this.loginProperties, { [LoginConstants.RUN_WIZARD]: false });
		this.setLoginProperties(newProps);

		this.trigger(this.getState());
	},

	// Ready for use
	onConnectCompleted() {
		this._socketAuthenticated = true;
		this.trigger(this.getState());
	},

	// Can't connect to the server or session not valid
	onConnectFailed(error) {
		if (error.code == 400) {
			this.reset();
			this._lastError = 'Session lost';
		} else { 
			this._lastError = error.message ? error.message : error;
		}

		this.trigger(this.getState());
	},

	hasAccess(access) {
		const { permissions } = this.loginProperties;
		return permissions.indexOf(access) !== -1 || permissions.indexOf(AccessConstants.ADMIN) !== -1;
	},

	onSocketDisconnected(socket, error, code) {
		this._socketAuthenticated = false;
		if (this.user) {
			if (error === '') {
				this._lastError = 'Connection closed';
			} else {
				this._lastError = error;
			}
		}

		this.trigger(this.getState());
	},

	onLogoutCompleted() {
		this.reset();
		this.trigger(this.getState());
	},

	reset() {
		this._lastError = null;
		this._socketAuthenticated = false;

		this.setLoginProperties({});
	},

	get lastError() {
		return this._lastError;
	},

	get socketAuthenticated() {
		return this._socketAuthenticated;
	},

	get user() {
		return this.loginProperties.user;
	},

	get token() {
		return this.loginProperties.token;
	},

	get isLoggedIn() {
		return !!this.loginProperties.user;
	},

	get systemInfo() {
		return this.loginProperties.system;
	},

	get awayIdleTime() {
		return this.loginProperties.away_idle_time;
	},

	get showNewUserIntro() {
		return this.loginProperties[LoginConstants.RUN_WIZARD];
	},
});

export default LoginStore;