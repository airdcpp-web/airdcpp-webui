import * as React from 'react';

import SystemActions from 'actions/ui/SystemActions';
import ActionButton from 'components/ActionButton';
import RemoteSettingForm from 'routes/Settings/components/RemoteSettingForm';

import { SettingPageProps } from 'routes/Settings/types';

const Generic = [
  'web_server_threads',
  'default_idle_timeout',
  'ping_interval',
  'ping_timeout',
];

const Hooks = [
  'share_file_validation_hook_timeout',
  'share_directory_validation_hook_timeout',
  'new_share_file_validation_hook_timeout',
  'new_share_directory_validation_hook_timeout',

  'outgoing_chat_message_hook_timeout',
  'incoming_chat_message_hook_timeout',

  'queue_add_bundle_hook_timeout',
  'queue_add_bundle_file_hook_timeout',
  'queue_add_source_hook_timeout',
  'queue_bundle_finished_hook_timeout',
  'queue_file_finished_hook_timeout',

  'list_menuitems_hook_timeout',
];

const ServerSettingsPage: React.FC<SettingPageProps> = (props) => {
  const { translate } = props.moduleT;
  return (
    <div>
      <ActionButton actions={SystemActions} actionId="restartWeb" />
      <RemoteSettingForm keys={Generic} />
      <div className="ui header">{translate('Hook timeouts')}</div>
      <div className="ui segment">
        <RemoteSettingForm keys={Hooks} />
      </div>
    </div>
  );
};

export default ServerSettingsPage;
