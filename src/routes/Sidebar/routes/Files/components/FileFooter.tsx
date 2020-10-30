import * as React from 'react';

import RedrawDecorator from 'decorators/RedrawDecorator';
import { formatRelativeTime } from 'utils/ValueFormat';
import { FooterItem, SessionFooter } from 'routes/Sidebar/components/SessionFooter';
import { useMobileLayout } from 'utils/BrowserUtils';

import * as API from 'types/api';
import * as UI from 'types/ui';


interface FileFooterProps {
  item: API.ViewFile;
  sessionT: UI.ModuleTranslator;
}

const FileFooter: React.FC<FileFooterProps> = ({ item, sessionT }) => {
  if (useMobileLayout()) {
    return null;
  }

  const downloadState = item.download_state;
  return (
    <SessionFooter>
      <FooterItem 
        label={ sessionT.translate(downloadState ? 'Downloaded' : 'Opened') } 
        text={ formatRelativeTime(downloadState ? downloadState.time_finished : item.time_opened) }
      />
    </SessionFooter>
  );
};

export default RedrawDecorator(FileFooter);