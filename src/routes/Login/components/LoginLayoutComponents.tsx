import * as React from 'react';

import Button from 'components/semantic/Button';
import Message from 'components/semantic/Message';
import { TFunction } from 'i18next';
import { toI18nKey, translate } from 'utils/TranslationUtils';

import * as UI from 'types/ui';


interface ErrorBoxProps {
  lastError: string | null;
  t: TFunction;
}

export const ErrorBox: React.FC<ErrorBoxProps> = ({ lastError, t }) => {
  if (lastError === null) {
    return null;
  }

  return (
    <Message 
      isError={ true } 
      description={ t<string>(toI18nKey('authenticationFailed', UI.Modules.LOGIN), {
        defaultValue: 'Authentication failed: {{lastError}}',
        replace: {
          lastError
        } 
      }) }
    />
  );
};

interface SubmitButtonProps {
  onSubmit: (evt: React.SyntheticEvent) => void;
  loading: boolean;
  allowLogin: boolean;
  t: TFunction;
}

export const SubmitButton: React.FC<SubmitButtonProps> = ({ onSubmit, loading, allowLogin, t }) => {
  if (!allowLogin) {
    return null;
  }

  return (
    <Button
      className="fluid large submit"
      caption={ translate('Login', t, UI.Modules.LOGIN) }
      type="submit"
      loading={ loading }
      onClick={ onSubmit }
    />
  );
};

export const BottomMessage = () => {
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
