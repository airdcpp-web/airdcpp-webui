import React from 'react';

import RemoteSettingForm from 'routes/Settings/components/RemoteSettingForm';

import Accordion from 'components/semantic/Accordion';

import ExternalLink from 'components/ExternalLink';
import LinkConstants from 'constants/LinkConstants';

import LogSection from 'routes/Settings/routes/System/components/LogSection';
import Message from 'components/semantic/Message';
import { SettingSectionChildProps } from 'routes/Settings/components/SettingSection';

const Entry = [
  'log_directory',
];

const sections = [
  'main',
  'pm',
  'downloads',
  'uploads',
  'syslog',
  'status',
];

const LoggingPage: React.SFC<SettingSectionChildProps> = props => (
  <div>
    <RemoteSettingForm
      { ...props }
      keys={ Entry }
    />
    <div className="sections">
      <div className="ui header">Sections</div>
      <Message
        icon="blue info"
        description={
          <ExternalLink url={ LinkConstants.VARIABLE_HELP_URL }>
            Variable information for Filename and Format fields
          </ExternalLink>
        }
      />
      <Accordion className="styled" controlled={ true }>
        { sections.map(section => (
          <LogSection 
            { ...props }
            key={ section } 
            section={ section }
          />
        )) }
      </Accordion>
    </div>
  </div>
);

export default LoggingPage;