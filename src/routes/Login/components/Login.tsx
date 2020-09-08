import React, { useState, useRef } from 'react';

import LoginActions from 'actions/reflux/LoginActions';
import LoginStore from 'stores/LoginStore';

import Checkbox from 'components/semantic/Checkbox';
import { RouteComponentProps } from 'react-router';
import SocketConnectStatus from 'components/main/SocketConnectStatus';
import { useLoginState, LoginLocationState } from '../effects/UseLoginStateEffect';
import { ErrorBox, BottomMessage, SubmitButton } from './LoginLayoutComponents';

import '../style.css';
import { useTranslation } from 'react-i18next';
import { translate } from 'utils/TranslationUtils';

import * as UI from 'types/ui';
import Icon from 'components/semantic/Icon';
import IconConstants from 'constants/IconConstants';


const ENTER_KEY_CODE = 13;

interface LoginProps extends RouteComponentProps<{}, any, LoginLocationState> {

}


const Login: React.FC<LoginProps> = props => {
  const { t } = useTranslation();
  const [ rememberMe, setRememberMe ] = useState(false);
  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const [ loading, setLoading ] = useLoginState(props);
  if (!!LoginStore.refreshToken) {
    return (
      <SocketConnectStatus
        message={ translate('Connecting to the server...', t, UI.Modules.LOGIN) }
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
                <Icon icon={ IconConstants.USER }/>
                <input 
                  ref={ usernameRef } 
                  type="text" 
                  name="username" 
                  placeholder={ translate('Username', t, UI.Modules.LOGIN) }
                  required={ true }
                  autoFocus={ true }
                />
              </div>
            </div>
            <div className="field">
              <div className="ui left icon input">
                <Icon icon={ IconConstants.LOCK }/>
                <input 
                  ref={ passwordRef }
                  className="password" 
                  name="password" 
                  placeholder={ translate('Password', t, UI.Modules.LOGIN) } 
                  required={ true }
                  type="password"
                />
              </div>
            </div>
            <SubmitButton
              onSubmit={ onSubmit }
              loading={ loading }
              allowLogin={ LoginStore.allowLogin }
              t={ t }
            />
            <div 
              className="field" 
              style={{
                marginTop: '10px',
                marginBottom: '3px'
              }}
            >
              <Checkbox
                caption={ translate('Keep me logged in', t, UI.Modules.LOGIN) }
                onChange={ setRememberMe }
                checked={ rememberMe }
              />
            </div>
          </div>

          <BottomMessage/>
        </form>

        <ErrorBox 
          lastError={ LoginStore.lastError }
          t={ t }
        />
      </div>
    </div>
  );
};

export default Login;
