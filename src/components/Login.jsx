import React, { findDOMNode } from 'react';
//import ReactMixin from 'react-mixin';
import Reflux from 'reflux';
import LoginActions from '../actions/LoginActions'
import LoginStore from '../stores/LoginStore'

import Tcomb from 'tcomb-form';
import { Icon, Message, Content } from 'react-semantify'
import { Navigation } from 'react-router';

var Form = Tcomb.form.Form;
var User = Tcomb.struct({
  username: Tcomb.Str,
  password: Tcomb.Str
});


var ErrorBox = React.createClass({
  render: function() {
    if (this.props.lastError === null) {
      return null;
    }

    var errorMessage = "Authentication failed: " + this.props.lastError;

    return (
      <Message className="error">
        <Content>
          <p>{ errorMessage }</p>
        </Content>
      </Message>
    );
  }
});

var ENTER_KEY_CODE = 13;

export default React.createClass({
  mixins: [Reflux.connect(LoginStore), Navigation ],
  getInitialState() {
    return {
      username: '',
      password: ''
    }
  },

  componentWillUpdate(nextProps, nextState) {
    if (nextState.socketAuthenticated) {
      var nextPath = this.props.location.state ? this.props.location.state.nextPath : '/';
      this.replaceWith(nextPath);
    }
  },

  _onKeyDown: function(event) {
    if (event.keyCode === ENTER_KEY_CODE) {
      this.onSubmit(event);
    }
  },

  onSubmit(evt) {
    var username = findDOMNode(this.refs.username).value;
    var password = findDOMNode(this.refs.password).value;
    evt.preventDefault();

    if (username === "" || password === "") {
      setState({ lastError: "Please enter both username and password" });
      return;
    }

    LoginActions.login(username, password);
    //var value = this.refs.form.getValue();
    //if (value) {
    //  LoginActions.login(value.username, value.password);
    //}
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

    /*var options = {
      auto: 'placeholders',
      fields: {
        password: {
          type: 'password',
          attrs: {
            className: 'ui stacked segment password'
          }
        },
        username: {
          attrs: {
            className: 'ui stacked segment username'
          }
        }
      }
    };


    return (
      <div className="ui middle aligned center aligned grid">
        <div className="column">
          <div className="ui stacked segment">
          <Form ref="form"
            type={User}
            options={options}
          />
          </div>

          <button className="ui fluid large teal submit button" type="submit" onClick={this.onSubmit}>Submit</button>

          <ErrorBox userLoggedIn={this.state.userLoggedIn} lastError={this.state.lastError}/>
        </div>
      </div>
    );*/
  }
});

//ReactMixin(Login.prototype, React.addons.LinkedStateMixin);
