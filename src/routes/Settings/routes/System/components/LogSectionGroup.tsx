import * as React from 'react';

import Accordion from 'components/semantic/Accordion';

import LogSection from 'routes/Settings/routes/System/components/LogSection';
import { SettingSectionChildProps } from 'routes/Settings/components/SettingSection';

interface LogSectionGroupProps extends SettingSectionChildProps {
  sectionKeys: string[];
  title: string;
  simpleKeys?: string[];
}

const LogSectionGroup: React.FC<LogSectionGroupProps> = (props) => {
  const { title, sectionKeys, simpleKeys, ...other } = props;
  return (
    <div>
      <div className="sections">
        <div className="ui header">{title}</div>
        <Accordion className="styled" controlled={true}>
          {sectionKeys.map((sectionKey) => (
            <LogSection
              {...other}
              key={sectionKey}
              section={sectionKey}
              simple={!!simpleKeys && simpleKeys.indexOf(sectionKey) !== -1}
            />
          ))}
        </Accordion>
      </div>
    </div>
  );
};

export default LogSectionGroup;
