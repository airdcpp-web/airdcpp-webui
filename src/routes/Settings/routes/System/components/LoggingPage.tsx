import * as React from 'react';

import RemoteSettingForm from 'routes/Settings/components/RemoteSettingForm';

import ExternalLink from 'components/ExternalLink';
import LinkConstants from 'constants/LinkConstants';

import Message from 'components/semantic/Message';
import { SettingSectionChildProps } from 'routes/Settings/components/SettingSection';
import IconConstants from 'constants/IconConstants';
import LogSectionGroup from './LogSectionGroup';


// Generic options
const Entry = [
  'log_directory',
];

// Sections
const MessageSectionKeys = [
  'main',
  'pm',
  'syslog',
  'status',
];

const TransferSectionKeys = [
  'downloads',
  'uploads',
  'list_transfers',
];

const SimpleSectionKeys = [
  'list_transfers',
];

const LoggingPage: React.FC<SettingSectionChildProps> = props => {
  const { t, translate } = props.moduleT;
  return (
    <div>
      <RemoteSettingForm
        { ...props }
        keys={ Entry }
      />
      <div className="sections">
        <Message
          icon={ IconConstants.INFO }
          description={
            <ExternalLink url={ LinkConstants.VARIABLE_HELP_URL }>
              { t('variableHelp', 'Variable information for Filename and Format fields') }
            </ExternalLink>
          }
        />
        <LogSectionGroup
          { ...props }
          sectionKeys={ MessageSectionKeys }
          title={ translate('Messages') }
        />
        <LogSectionGroup
          { ...props }
          sectionKeys={ TransferSectionKeys }
          title={ translate('Transfers') }
          simpleKeys={ SimpleSectionKeys }
        />
      </div>
    </div>
  );
};

export default LoggingPage;