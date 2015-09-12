'use strict';
import Reflux from 'reflux';
import SocketService from '../services/SocketService'
//import SocketActions from '../services/SocketActions'
import SocketStore from '../stores/SocketStore'
import RouterContainer from '../services/RouterContainer'
import {LOGIN_URL, CONNECT_URL, LOGOUT_URL} from '../constants/LoginConstants';

export var LoginActions = Reflux.createActions([
  { "login": { asyncResult: true} },
  { "connect": { asyncResult: true} },
  { "logout": { asyncResult: true} }
]);

LoginActions.login.listen(function(username, password) {
  var that = this;

  SocketService.connect();
  let unsubscribe = SocketStore.listen((socket, error) => {
    if (socket) {
      SocketService.post(LOGIN_URL, { username: username, password: password })
        .then(that.completed)
        .catch(that.failed);
    } else {
      that.failed(error);
    }

    unsubscribe();
  });
});

LoginActions.connect.listen(function(token) {
  var that = this;

  SocketService.reconnect();
  let unsubscribe = SocketStore.listen((socket, error) => {
    if (socket) {
      SocketService.post(CONNECT_URL, { authorization: token })
        .then(that.completed)
        .catch(that.failed);

        unsubscribe();
    }
    //unsubscribe();
  });
});

LoginActions.logout.listen(function() {
  var that = this;
  return SocketService.delete(LOGOUT_URL)
    .then(that.completed)
    .catch(this.failed);
});

LoginActions.logout.completed.listen(function() {
  SocketService.disconnect();
  /*let unsubscribe = SocketStore.listen((socket) => {
    if (!socket) {
      RouterContainer.get().transitionTo('/');
    }

    unsubscribe();
  });*/

  //SocketService.disconnect();
  //RouterContainer.get().transitionTo('/');
});


export default LoginActions;



/*import AppDispatcher from '../dispatchers/AppDispatcher.js';
import {LOGIN_USER, LOGOUT_USER} from '../constants/LoginConstants.js';
import RouterContainer from '../services/RouterContainer'
import SocketService from '../services/SocketService'

export default {
  loginUser: (loginObj) => {
    var savedLogin = sessionStorage.getItem('login');

    if (savedLogin !== loginObj) {
      var nextPath = RouterContainer.get().getCurrentQuery().nextPath || '/';

      RouterContainer.get().transitionTo(nextPath);
      sessionStorage.setItem('login', loginObj);
    }

    AppDispatcher.dispatch({
      actionType: LOGIN_USER,
      login: JSON.parse(loginObj)
    });
  },
  logoutUser: () => {
    RouterContainer.get().transitionTo('/');
    sessionStorage.removeItem('login');
    SocketService.disconnect();
    AppDispatcher.dispatch({
      actionType: LOGOUT_USER
    });
  }
}*/
