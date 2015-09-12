import {LOGIN_URL, SIGNUP_URL, LOGOUT_URL} from '../constants/LoginConstants';
import LoginActions from '../actions/LoginActions';
import { del, post } from '../utils/RestAPI';

class AuthService {

  login(username, password) {
    var request = post(LOGIN_URL);
    request.send({ username: username, password: password });
    request.end(function(err, res){
      if (err) {
        alert("There's an error logging in: " + err);
        console.log("Error logging in", err);
        return;
      }

      LoginActions.loginUser(res.text);
    });
  }

  logout() {
    del(LOGOUT_URL)
      .end(function(err, res){
        if (err) {
          alert("There's an error logging out");
          console.log("Error logging out", err);
        }

        LoginActions.logoutUser();
      });
  }
  
  handleAuth(loginPromise) {
    return loginPromise
      .then(function(response) {
        var jsonResponse = response.responseText;
        LoginActions.loginUser(jsonResponse);
        return true;
      });
  }
}

export default new AuthService()
