import React from 'react';
import RemoteSettingForm from 'routes/Settings/components/RemoteSettingForm';

import ActionButton from 'components/ActionButton';
import Message from 'components/semantic/Message';
import SystemActions from 'actions/ui/SystemActions';
import { SettingSectionChildProps } from 'routes/Settings/components/SettingSection';
import IconConstants from 'constants/IconConstants';


const PlainEntry = [
  'web_plain_port',
  'web_plain_bind_address',
];

const TlsEntry = [
  'web_tls_port',
  'web_tls_bind_address',

  'web_tls_certificate_path',
  'web_tls_certificate_key_path',
];

const Generic = [
  'web_server_threads',
  'default_idle_timeout',
  'ping_interval',
  'ping_timeout',
];

const ServerSettingsPage: React.FC<SettingSectionChildProps> = props => {
  const { t, translate } = props.moduleT;
  return (
    <div>
      {/*<Message 
        description={ (
          <div>
            <div>
              New settings will take effect after restarting the management interface
            </div>
            <ActionButton 
              action={ SystemActions.restartWeb }
            />
          </div>
        ) }
        icon={ IconConstants.INFO }
      />*/}

      <ActionButton 
        actions={ SystemActions }
        actionId="restartWeb"
      />

      <div className="ui header">
        HTTP
      </div>
      <div className="ui segment">
        <RemoteSettingForm
          { ...props }
          keys={ PlainEntry }
        />
      </div>

      <div className="ui header">
        HTTPS
      </div>
      <div className="ui segment">
        <RemoteSettingForm
          { ...props }
          keys={ TlsEntry }
        />

        <Message 
          description={ t<string>(
            'defaultCertNote', 
            'The default client certificate is used if the certificate paths are empty') 
          }
          icon={ IconConstants.INFO }
        />
      </div>

      <div className="ui header">
        { translate('Advanced') }
      </div>
      <div className="ui segment">
        <RemoteSettingForm
          { ...props }
          keys={ Generic }
        />
      </div>
    </div>
  );
};

export default ServerSettingsPage;