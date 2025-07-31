import * as React from 'react';

import Button from '@/components/semantic/Button';
import Message from '@/components/semantic/Message';
import { toI18nKey, translate } from '@/utils/TranslationUtils';

import * as UI from '@/types/ui';

import { parseLoginError } from '@/utils/AuthUtils';

interface ErrorBoxProps {
  lastError: UI.LoginError | null;
  t: UI.TranslateF;
}

export const ErrorBox: React.FC<ErrorBoxProps> = ({ lastError, t }) => {
  if (lastError === null) {
    return null;
  }

  return (
    <Message
      isError={true}
      description={t(toI18nKey('authenticationFailed', UI.Modules.LOGIN), {
        defaultValue: 'Authentication failed: {{lastError}}',
        replace: {
          lastError: parseLoginError(lastError, t),
        },
      })}
    />
  );
};

interface SubmitButtonProps {
  onSubmit: (evt: React.SyntheticEvent) => void;
  loading: boolean;
  allowLogin: boolean;
  t: UI.TranslateF;
}

export const SubmitButton: React.FC<SubmitButtonProps> = ({
  onSubmit,
  loading,
  allowLogin,
  t,
}) => {
  if (!allowLogin) {
    return null;
  }

  return (
    <Button
      className="fluid large submit"
      caption={translate('Login', t, UI.Modules.LOGIN)}
      type="submit"
      loading={loading}
      onClick={onSubmit}
    />
  );
};

export const BottomMessage = () => {
  if (!isDemoInstance()) {
    return null;
  }

  return (
    <div className="ui stacked segment">
      <Message
        description={
          <div>
            Username: <strong>demo</strong>
            <br />
            Password: <strong>demo</strong>
          </div>
        }
      />
    </div>
  );
};
