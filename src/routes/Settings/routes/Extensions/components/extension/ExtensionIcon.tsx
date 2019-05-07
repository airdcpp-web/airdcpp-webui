import React from 'react';

import Icon from 'components/semantic/Icon';

import * as API from 'types/api';
import IconConstants from 'constants/IconConstants';


const getCornerIcon = (installedPackage: API.Extension | undefined, hasUpdate: boolean) => {
  if (!installedPackage) {
    return null;
  }

  if (hasUpdate) {
    return 'yellow warning circle';
  }

  if (!installedPackage.managed) {
    return 'blue external square';
  }

  return 'green check circle';
};

interface ExtensionIconProps {
  installedPackage?: API.Extension;
  hasUpdate: boolean;
}

const ExtensionIcon: React.FC<ExtensionIconProps> = ({ installedPackage, hasUpdate }) => (
  <div className="ui image">
    <Icon 
      icon={ IconConstants.EXTENSION }
      size="huge" 
      cornerIcon={ getCornerIcon(installedPackage, hasUpdate) }
    />
  </div>
);

export default ExtensionIcon;