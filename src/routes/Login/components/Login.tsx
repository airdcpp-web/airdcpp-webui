import React, { useState, useEffect, useRef } from 'react';
import History from 'utils/History';

import LoginActions from 'actions/LoginActions';
import LoginStore from 'stores/LoginStore';

import Button from 'components/semantic/Button';
import Message from 'components/semantic/Message';

import '../style.css';
import { Location } from 'history';


const ErrorBox: React.SFC<{ lastError: string | null }> = ({ lastError }) => {
  if (lastError === null) {
    return null;
  }

  return (
    <Message 
      isError={ true } 
      description={ 'Authentication failed: ' + lastError }
    />
  );
};

interface SubmitButtonProps {
  onSubmit: (evt: React.SyntheticEvent) => void;
  loading: boolean;
  allowLogin: boolean;
}

const SubmitButton: React.SFC<SubmitButtonProps> = ({ onSubmit, loading, allowLogin }) => {
  if (!allowLogin) {
    return null;
  }

  return (
    <Button
      className="fluid large submit"
      caption="Login"
      type="submit"
      loading={ loading }
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


interface LoginState {
  socketAuthenticated: boolean;
  lastError: string | null;
}

interface LoginProps {
  location: Location;
}

const Login: React.SFC<LoginProps> = ({ location }) => {
  const [ loading, setLoading ] = useState(false);
  const usernameRef = useRef<HTMLInputElement>();
  const passwordRef = useRef<HTMLInputElement>();

  useEffect(
    () => {
      return LoginStore.listen((loginInfo: LoginState) => {
        if (loginInfo.socketAuthenticated) {
          const nextPath = location.state ? location.state.nextPath : '/';
          History.replace({
            pathname: nextPath,
          });
        } else if (loading && !!loginInfo.lastError) {
          setLoading(false);
        }
      });
    }
  );

  const onSubmit = (evt: React.SyntheticEvent) => {
    const username = usernameRef.current!.value;
    const password = passwordRef.current!.value;
    evt.preventDefault();

    if (!username || !password) {
      return;
    }

    LoginActions.login(username, password);
    setLoading(true);
  };


  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.keyCode === ENTER_KEY_CODE) {
      onSubmit(event);
    }
  };

  return (
    <div className="ui middle aligned center aligned grid login-grid">
      <div className="column">
        <form className="ui large form" onKeyDown={ onKeyDown } autoComplete="on">
          <div className="ui stacked segment">
            <div className="field">
              <div className="ui left icon input">
                <i className="user icon"/>
                <input 
                  ref={ usernameRef } 
                  type="text" 
                  name="username" 
                  placeholder="Username" 
                  autoFocus={ true }
                />
              </div>
            </div>
            <div className="field">
              <div className="ui left icon input">
                <i className="lock icon"/>
                <input 
                  ref={ passwordRef }
                  className="password" 
                  name="password" 
                  placeholder="Password"  
                  type="password"
                />
              </div>
            </div>

            <SubmitButton
              onSubmit={ onSubmit }
              loading={ loading }
              allowLogin={ LoginStore.allowLogin }
            />
          </div>

          <BottomMessage/>
        </form>

        <ErrorBox 
          lastError={ LoginStore.lastError }
        />
      </div>
    </div>
  );
};

export default Login;