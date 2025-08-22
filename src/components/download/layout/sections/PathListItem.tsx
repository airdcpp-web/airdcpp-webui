import * as React from 'react';

import IconConstants from '@/constants/IconConstants';

import Icon from '@/components/semantic/Icon';

import { toI18nKey } from '@/utils/TranslationUtils';
import { Formatter, useFormatter } from '@/context/FormatterContext';

import * as API from '@/types/api';
import * as UI from '@/types/ui';
import { PathDownloadHandler } from '../../types';
import LinkButton from '@/components/semantic/LinkButton';

interface PathItemProps {
  pathInfo: API.DiskSpaceInfo;
  downloadHandler: PathDownloadHandler;
  t: UI.TranslateF;
}

const formatFreeSpace = (
  pathInfo: API.DiskSpaceInfo,
  t: UI.TranslateF,
  { formatSize }: Formatter,
) => {
  if (pathInfo.free_space <= 0) {
    return pathInfo.path;
  }

  return ` (${t(toI18nKey('spaceFree', UI.Modules.COMMON), {
    defaultValue: '{{freeSpace}} free',
    replace: {
      freeSpace: formatSize(pathInfo.free_space),
    },
  })})`;
};

export const PathListItem: React.FC<PathItemProps> = ({
  pathInfo,
  downloadHandler,
  t,
}) => {
  const formatter = useFormatter();
  return (
    <div className="item">
      <Icon icon={IconConstants.FOLDER} />
      <div className="content">
        <LinkButton
          onClick={() => downloadHandler(pathInfo.path)}
          aria-label={pathInfo.path}
          caption={
            <>
              {pathInfo.path}
              <span className="disk-info">{formatFreeSpace(pathInfo, t, formatter)}</span>
            </>
          }
        />
      </div>
    </div>
  );
};
