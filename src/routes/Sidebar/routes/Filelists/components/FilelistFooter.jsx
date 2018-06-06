'use strict';
import React from 'react';

import { formatSize } from 'utils/ValueFormat';
import { FooterItem, SessionFooter } from 'routes/Sidebar/components/SessionFooter';
import { useMobileLayout } from 'utils/BrowserUtils';


const FilelistFooter = ({ session }) => {
  if (useMobileLayout()) {
    return null;
  }

  let locationText = session.location.type.str;
  if (locationText.length > 0) {
    locationText = formatSize(session.location.size) + ' (' + locationText + ')';
  }

  return (
    <SessionFooter>
      <FooterItem label="Directory size" text={ locationText }/>
      <FooterItem label="Total list size" text={ formatSize(session.total_size) }/>
    </SessionFooter>
  );
};

export default FilelistFooter;