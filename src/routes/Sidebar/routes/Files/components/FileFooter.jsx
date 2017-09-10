'use strict';
import React from 'react';

import RedrawDecorator from 'decorators/RedrawDecorator';
import ValueFormat from 'utils/ValueFormat';
import { FooterItem, SessionFooter } from 'routes/Sidebar/components/SessionFooter';
import BrowserUtils from 'utils/BrowserUtils';


const FileFooter = ({ item }) => {
  if (BrowserUtils.useMobileLayout()) {
    return null;
  }

  const downloadState = item.download_state;
  return (
    <SessionFooter>
      <FooterItem 
        label={ downloadState ? 'Downloaded' : 'Opened' } 
        text={ ValueFormat.formatRelativeTime(downloadState ? downloadState.time_finished : item.time_opened) }
      />
    </SessionFooter>
  );
};

export default RedrawDecorator(FileFooter);