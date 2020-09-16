//import PropTypes from 'prop-types';
import React from 'react';
import { TFunction } from 'i18next';

import IconConstants from 'constants/IconConstants';

import Icon from 'components/semantic/Icon';

import { toI18nKey } from 'utils/TranslationUtils';
import { formatSize } from 'utils/ValueFormat';

import * as API from 'types/api';
import * as UI from 'types/ui';
import { PathDownloadHandler } from '../../types';


interface PathItemProps {
  pathInfo: API.DiskSpaceInfo;
  downloadHandler: PathDownloadHandler;
  t: TFunction;
}

const formatFreeSpace = (pathInfo: API.DiskSpaceInfo, t: TFunction) => {
  if (pathInfo.free_space <= 0) {
    return pathInfo.path;
  }

  return ` (${t(
    toI18nKey('spaceFree', UI.Modules.COMMON),
    {
      defaultValue: '{{freeSpace}} free',
      replace: {
        freeSpace: formatSize(pathInfo.free_space, t)
      }
    }
  )})`;
};

export const PathListItem: React.FC<PathItemProps> = ({ pathInfo, downloadHandler, t }) => (
  <div className="item">
    <Icon icon={ IconConstants.FOLDER }/>
    <div className="content">
      <a onClick={ evt => downloadHandler(pathInfo.path) }>
        { pathInfo.path }
        <span className="disk-info">
          { formatFreeSpace(pathInfo, t) }
        </span>
      </a>
    </div>
  </div>
);
