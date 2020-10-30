'use strict';
import * as React from 'react';

import { formatSize } from 'utils/ValueFormat';
import { FooterItem, SessionFooter } from 'routes/Sidebar/components/SessionFooter';
import { useMobileLayout } from 'utils/BrowserUtils';

import * as API from 'types/api';
import * as UI from 'types/ui';


interface FilelistFooterProps {
  session: API.FilelistSession;
  sessionT: UI.ModuleTranslator;
}

const FilelistFooter: React.FC<FilelistFooterProps> = ({ session, sessionT }) => {
  if (useMobileLayout()) {
    return null;
  }

  let locationText = session.location!.type.str;
  if (locationText.length > 0) {
    locationText = `${formatSize(session.location!.size, sessionT.plainT)} (${locationText})`;
  }

  return (
    <SessionFooter>
      <FooterItem 
        label={ sessionT.translate('Directory size') } 
        text={ locationText }
      />
      <FooterItem 
        label={ sessionT.translate('Total list size') } 
        text={ formatSize(session.total_size, sessionT.plainT) }
      />
    </SessionFooter>
  );
};

export default FilelistFooter;