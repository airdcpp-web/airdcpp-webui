//import PropTypes from 'prop-types';

import FilesystemConstants from 'constants/FilesystemConstants';

import DataProviderDecorator from 'decorators/DataProviderDecorator';

import Message from 'components/semantic/Message';

import { translate } from 'utils/TranslationUtils';

import * as API from 'types/api';
import * as UI from 'types/ui';

import { PathDownloadHandler } from '../../types';
import { PathListItem } from './PathListItem';

interface PathListProps {
  downloadHandler: PathDownloadHandler;
  paths: string[];
  t: UI.TranslateF;
}

interface PathListDataProps {
  pathInfos: API.DiskSpaceInfo[];
}

const PathListWithData = DataProviderDecorator<PathListProps, PathListDataProps>(
  function PathList({ downloadHandler, pathInfos, t }) {
    return (
      <div className="ui relaxed list">
        {pathInfos.map((pathInfo) => (
          <PathListItem
            key={pathInfo.path}
            pathInfo={pathInfo}
            downloadHandler={downloadHandler}
            t={t}
          />
        ))}
      </div>
    );
  },
  {
    urls: {
      pathInfos: ({ paths }, socket) =>
        socket.post(FilesystemConstants.DISK_INFO_URL, { paths }),
    },
  }
);

//PathList.PropTypes = {
// Function handling the path selection. Receives the selected path as argument.
//downloadHandler: PropTypes.func.isRequired,

// Array of paths to list
//paths: PropTypes.array.isRequired,
//};

const PathList: React.FC<PathListProps> = (props) => {
  if (props.paths.length === 0) {
    return (
      <Message title={translate('No paths to display', props.t, UI.Modules.COMMON)} />
    );
  }

  return <PathListWithData {...props} />;
};

export default PathList;
