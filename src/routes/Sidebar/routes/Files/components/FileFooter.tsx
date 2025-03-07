import * as React from 'react';

import RedrawDecorator from '@/decorators/RedrawDecorator';
import { useFormatter } from '@/context/FormatterContext';
import { FooterItem, SessionFooter } from '@/routes/Sidebar/components/SessionFooter';
import { usingMobileLayout } from '@/utils/BrowserUtils';

import * as API from '@/types/api';
import * as UI from '@/types/ui';

interface FileFooterProps {
  item: API.ViewFile;
  sessionT: UI.ModuleTranslator;
}

const FileFooter: React.FC<FileFooterProps> = ({ item, sessionT }) => {
  const { formatRelativeTime } = useFormatter();
  if (usingMobileLayout()) {
    return null;
  }

  const downloadState = item.download_state;
  return (
    <SessionFooter>
      <FooterItem
        label={sessionT.translate(downloadState ? 'Downloaded' : 'Opened')}
        text={formatRelativeTime(
          downloadState ? downloadState.time_finished : item.time_opened,
        )}
      />
    </SessionFooter>
  );
};

export default RedrawDecorator(FileFooter);
