import { useState, useRef } from 'react';

import { LoginAPIActions } from '@/actions/store/LoginActions';

import Checkbox from '@/components/semantic/Checkbox';
import SocketConnectStatus from '@/components/main/SocketConnectStatus';
import { useSessionState } from '../effects/LoginStateEffect';
import { ErrorBox, BottomMessage, SubmitButton } from './LoginLayoutComponents';

import { useTranslation } from 'react-i18next';
import { getModuleT } from '@/utils/TranslationUtils';

import * as UI from '@/types/ui';

import IconConstants from '@/constants/IconConstants';
import Input from '@/components/semantic/Input';
import { useSocket } from '@/context/SocketContext';
import { useAppStore, useAppStoreProperty } from '@/context/AppStoreContext';

import '../style.css';

interface LoginProps {}

const Login: React.FC<LoginProps> = () => {
  const { allowLogin, lastError, getRefreshToken } = useAppStoreProperty(
    (state) => state.login,
  );
  const { t } = useTranslation();
  const { translate } = getModuleT(t, UI.Modules.LOGIN);
  const socket = useSocket();
  const appStore = useAppStore();

  const [rememberMe, setRememberMe] = useState(false);
  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const { loading, setLoading } = useSessionState();
  if (!!getRefreshToken()) {
    return <SocketConnectStatus message={translate('Connecting to the server...')} />;
  }

  const onSubmit = (evt: React.SyntheticEvent) => {
    const username = usernameRef.current!.value;
    const password = passwordRef.current!.value;
    evt.preventDefault();

    if (!username || !password) {
      return;
    }

    LoginAPIActions.loginCredentials(
      {
        username,
        password,
        rememberMe,
      },
      {
        socket,
        appStore,
      },
    );
    setLoading(true);
  };

  return (
    <div className="ui middle aligned center aligned grid login-grid">
      <div className="column">
        <form
          className="ui large form"
          autoComplete="on"
          onSubmit={onSubmit}
          name="login"
        >
          <div className="ui stacked segment">
            <div className="field">
              <Input
                ref={usernameRef}
                icon={IconConstants.USER}
                name="username"
                placeholder={translate('Username')}
                required={true}
                autoFocus={true}
                type="text"
              />
            </div>
            <div className="field">
              <Input
                ref={passwordRef}
                icon={IconConstants.LOCK}
                className="password"
                name="password"
                placeholder={translate('Password')}
                required={true}
                type="password"
              />
            </div>
            <SubmitButton
              onSubmit={onSubmit}
              loading={loading}
              allowLogin={allowLogin}
              t={t}
            />
            <div
              className="field"
              style={{
                marginTop: '10px',
                marginBottom: '3px',
              }}
            >
              <Checkbox
                caption={translate('Keep me logged in')}
                onChange={setRememberMe}
                checked={rememberMe}
                id="remember-me"
              />
            </div>
          </div>

          <BottomMessage />
        </form>

        <ErrorBox lastError={lastError} t={t} />
      </div>
    </div>
  );
};

export default Login;
