import * as React from 'react';
import RemoteSettingForm from 'routes/Settings/components/RemoteSettingForm';

import ActionButton from 'components/ActionButton';
import Message from 'components/semantic/Message';
import {
  SystemActionModule,
  SystemRestartWebAction,
} from 'actions/ui/system/SystemActions';
import { SettingPageProps } from 'routes/Settings/types';
import IconConstants from 'constants/IconConstants';

const PlainEntry = ['web_plain_port', 'web_plain_bind_address'];

const TlsEntry = [
  'web_tls_port',
  'web_tls_bind_address',
  'web_tls_certificate_path',
  'web_tls_certificate_key_path',
];

const ServerSettingsPage: React.FC<SettingPageProps> = (props) => {
  const { t } = props.moduleT;
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

      <ActionButton action={SystemRestartWebAction} moduleData={SystemActionModule} />

      <div className="ui header">HTTP</div>
      <div className="ui segment">
        <RemoteSettingForm {...props} keys={PlainEntry} />
      </div>

      <div className="ui header">HTTPS</div>
      <div className="ui segment">
        <RemoteSettingForm {...props} keys={TlsEntry} />

        <Message
          description={t<string>(
            'defaultCertNote',
            'The default client certificate is used if the certificate paths are empty',
          )}
          icon={IconConstants.INFO}
        />
      </div>
    </div>
  );
};

export default ServerSettingsPage;
