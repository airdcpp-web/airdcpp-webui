import React from 'react';
import RemoteSettingForm from 'routes/Settings/components/RemoteSettingForm';

import ActionButton from 'components/ActionButton';
import Message from 'components/semantic/Message';
import SystemActions from 'actions/SystemActions';
import { SettingSectionChildProps } from 'routes/Settings/components/SettingSection';


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

const ServerSettingsPage: React.FC<SettingSectionChildProps> = props => (
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
			icon="blue info"
		/>*/}

    <ActionButton 
      action={ SystemActions.restartWeb }
    />

    <div className="ui header">HTTP</div>
    <div className="ui segment">
      <RemoteSettingForm
        { ...props }
        keys={ PlainEntry }
      />
    </div>

    <div className="ui header">HTTPS</div>
    <div className="ui segment">
      <RemoteSettingForm
        { ...props }
        keys={ TlsEntry }
      />

      <Message 
        description="The default client certificate is used if the certificate paths are empty"
        icon="blue info"
      />
    </div>

    <div className="ui header">Advanced</div>
    <div className="ui segment">
      <RemoteSettingForm
        { ...props }
        keys={ Generic }
      />
    </div>
  </div>
);

export default ServerSettingsPage;