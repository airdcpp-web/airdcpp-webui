//import PropTypes from 'prop-types';
import React from 'react';

import FilesystemConstants from 'constants/FilesystemConstants';

import DataProviderDecorator from 'decorators/DataProviderDecorator';
import { formatSize } from 'utils/ValueFormat';
import Message from 'components/semantic/Message';

import * as API from 'types/api';
import * as UI from 'types/ui';

import i18next from 'i18next';
import { translate, toI18nKey } from 'utils/TranslationUtils';
import IconConstants from 'constants/IconConstants';
import Icon from 'components/semantic/Icon';


interface PathItemProps {
  pathInfo: API.DiskSpaceInfo;
  downloadHandler: UI.PathDownloadHandler;
  t: i18next.TFunction;
}

const formatFreeSpace = (pathInfo: API.DiskSpaceInfo, t: i18next.TFunction) => {
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

const PathItem: React.FC<PathItemProps> = ({ pathInfo, downloadHandler, t }) => (
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

interface PathListProps {
  downloadHandler: UI.PathDownloadHandler;
  paths: string[];
  t: i18next.TFunction;
}

interface PathListDataProps {
  pathInfos: API.DiskSpaceInfo[];
}

const PathList = DataProviderDecorator<PathListProps, PathListDataProps>(
  ({ downloadHandler, pathInfos, t }) => (
    <div className="ui relaxed list">
      { pathInfos.map(pathInfo => (
        <PathItem 
          key={ pathInfo.path } 
          pathInfo={ pathInfo } 
          downloadHandler={ downloadHandler }
          t={ t }
        />
      )) }
    </div>
  ), 
  {
    urls: {
      pathInfos: ({ paths }, socket) => socket.post(FilesystemConstants.DISK_INFO_URL, { paths }),
    },
  }
);

//PathList.PropTypes = {
  // Function handling the path selection. Receives the selected path as argument.
  //downloadHandler: PropTypes.func.isRequired,

  // Array of paths to list
  //paths: PropTypes.array.isRequired,
//};

export default (props: PathListProps) => {
  if (props.paths.length === 0) {
    return (
      <Message
        title={ translate('No paths to display', props.t, UI.Modules.COMMON) }
      />
    );
  }

  return <PathList { ...props }/>;
};