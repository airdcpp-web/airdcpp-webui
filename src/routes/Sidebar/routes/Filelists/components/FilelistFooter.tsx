import * as React from 'react';

import { useFormatter } from '@/context/FormatterContext';
import { FooterItem, SessionFooter } from '@/routes/Sidebar/components/SessionFooter';
import { usingMobileLayout } from '@/utils/BrowserUtils';

import * as API from '@/types/api';
import * as UI from '@/types/ui';

interface FilelistFooterProps {
  filelist: API.FilelistSession;
  sessionT: UI.ModuleTranslator;
}

const FilelistFooter: React.FC<FilelistFooterProps> = ({ filelist, sessionT }) => {
  const { formatSize } = useFormatter();
  if (usingMobileLayout()) {
    return null;
  }

  let locationText = filelist.location!.type.str;
  if (locationText.length > 0) {
    locationText = `${formatSize(filelist.location!.size)} (${locationText})`;
  }

  return (
    <SessionFooter>
      <FooterItem label={sessionT.translate('Directory size')} text={locationText} />
      <FooterItem
        label={sessionT.translate('Total list size')}
        text={formatSize(filelist.total_size)}
      />
    </SessionFooter>
  );
};

export default FilelistFooter;
