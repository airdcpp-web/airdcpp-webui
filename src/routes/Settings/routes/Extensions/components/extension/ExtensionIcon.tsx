import * as React from 'react';

import Icon from 'components/semantic/Icon';

import * as API from 'types/api';
import IconConstants from 'constants/IconConstants';

const getCornerIcon = (
  installedPackage: API.Extension | undefined,
  hasUpdate: boolean,
) => {
  if (!installedPackage) {
    return null;
  }

  if (hasUpdate) {
    return 'yellow warning circle';
  }

  if (!installedPackage.managed) {
    return 'blue external square';
  }

  if (installedPackage.running) {
    return 'green play';
  }

  if (installedPackage.disabled) {
    return 'grey check circle';
  }

  return 'green check circle';
};

interface ExtensionIconProps {
  installedPackage?: API.Extension;
  hasUpdate: boolean;
  size?: string;
}

const ExtensionIcon: React.FC<ExtensionIconProps> = ({
  installedPackage,
  hasUpdate,
  size = 'huge',
}) => (
  <div className="ui image">
    <Icon
      icon={IconConstants.EXTENSION}
      color={installedPackage?.disabled ? 'grey' : undefined}
      size={size}
      cornerIcon={getCornerIcon(installedPackage, hasUpdate)}
    />
  </div>
);

export default ExtensionIcon;
