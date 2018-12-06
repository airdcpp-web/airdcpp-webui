import React, { useState, useRef } from 'react';

import LoginActions from 'actions/LoginActions';
import LoginStore from 'stores/LoginStore';

import Checkbox from 'components/semantic/Checkbox';
import { RouteComponentProps } from 'react-router';
import SocketConnectStatus from 'components/main/SocketConnectStatus';
import { useLoginState } from '../effects/UseLoginStateEffect';
import { ErrorBox, BottomMessage, SubmitButton } from './LoginLayoutComponents';

import '../style.css';


const ENTER_KEY_CODE = 13;

interface LoginProps extends RouteComponentProps {

}


const Login: React.FC<LoginProps> = props => {
  const [ rememberMe, setRememberMe ] = useState(false);
  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const [ loading, setLoading ] = useLoginState(props);
  if (!!LoginStore.refreshToken) {
    return (
      <SocketConnectStatus
        message="Authenticating..."
      />
    );
  }

  const onSubmit = (evt: React.SyntheticEvent) => {
    const username = usernameRef.current!.value;
    const password = passwordRef.current!.value;
    evt.preventDefault();

    if (!username || !password) {
      return;
    }

    LoginActions.login(username, password, rememberMe);
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
                  required={ true }
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
                  required={ true }
                  type="password"
                />
              </div>
            </div>
            <SubmitButton
              onSubmit={ onSubmit }
              loading={ loading }
              allowLogin={ LoginStore.allowLogin }
            />
            <div 
              className="field" 
              style={{
                marginTop: '10px',
              }}
            >
              <Checkbox
                caption="Keep me logged in" 
                onChange={ setRememberMe }
                checked={ rememberMe }
              />
            </div>
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
