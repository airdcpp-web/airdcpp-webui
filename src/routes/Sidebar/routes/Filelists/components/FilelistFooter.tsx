import * as React from 'react';

import { useFormatter } from 'context/FormatterContext';
import { FooterItem, SessionFooter } from 'routes/Sidebar/components/SessionFooter';
import { useMobileLayout } from 'utils/BrowserUtils';

import * as API from 'types/api';
import * as UI from 'types/ui';

interface FilelistFooterProps {
  session: API.FilelistSession;
  sessionT: UI.ModuleTranslator;
}

const FilelistFooter: React.FC<FilelistFooterProps> = ({ session, sessionT }) => {
  const { formatSize } = useFormatter();
  if (useMobileLayout()) {
    return null;
  }

  let locationText = session.location!.type.str;
  if (locationText.length > 0) {
    locationText = `${formatSize(session.location!.size)} (${locationText})`;
  }

  return (
    <SessionFooter>
      <FooterItem label={sessionT.translate('Directory size')} text={locationText} />
      <FooterItem
        label={sessionT.translate('Total list size')}
        text={formatSize(session.total_size)}
      />
    </SessionFooter>
  );
};

export default FilelistFooter;
