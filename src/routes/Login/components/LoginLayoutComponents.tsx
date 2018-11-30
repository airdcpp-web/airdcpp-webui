import React from 'react';

import Button from 'components/semantic/Button';
import Message from 'components/semantic/Message';



export const ErrorBox: React.FC<{ lastError: string | null }> = ({ lastError }) => {
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

export const SubmitButton: React.FC<SubmitButtonProps> = ({ onSubmit, loading, allowLogin }) => {
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
