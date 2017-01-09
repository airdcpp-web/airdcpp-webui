'use strict';
import Reflux from 'reflux';
import SocketService from 'services/SocketService';

import AccessConstants from 'constants/AccessConstants';
import IconConstants from 'constants/IconConstants';
import LoginConstants from 'constants/LoginConstants';
import SettingConstants from 'constants/SettingConstants';


export const LoginActions = Reflux.createActions([
	{ 'login': { asyncResult: true } },
	{ 'connect': { asyncResult: true } },
	{ 'logout': { asyncResult: true } },
	{ 'activity': { asyncResult: true } },
	{ 'newUserIntroSeen': {
		asyncResult: true,
		displayName: "Close and don't show again",
		access: AccessConstants.SETTINGS_EDIT,
		icon: IconConstants.SAVE,
	} },
]);


LoginActions.activity.listen(function (away) {
	let that = this;
	return SocketService.post(LoginConstants.ACTIVITY_URL)
		.then(that.completed)
		.catch(that.failed);
});

LoginActions.newUserIntroSeen.listen(function (away) {
	let that = this;
	return SocketService.post(SettingConstants.ITEMS_SET_URL, { [LoginConstants.WIZARD_PENDING]: false })
		.then(that.completed)
		.catch(that.failed);
});

LoginActions.login.listen(function (username, password) {
	let that = this;

	SocketService.connect(username, password, false)
		.then(that.completed)
		.catch(that.failed);
});

LoginActions.login.failed.listen(function (error) {
	console.log('Logging in failed', error);
});


LoginActions.connect.listen(function (token) {
	let that = this;

	SocketService.reconnect(token)
		.then(that.completed)
		.catch(that.failed);
});

LoginActions.connect.failed.listen(function (token) {

});

LoginActions.logout.listen(function () {
	let that = this;
	return SocketService.destroy()
		.then(that.completed)
		.catch(this.failed);
});


export default LoginActions;
