import PropTypes from 'prop-types';
import React from 'react';

import FilesystemConstants from 'constants/FilesystemConstants';

import DataProviderDecorator from 'decorators/DataProviderDecorator';
import ValueFormat from 'utils/ValueFormat';
import Message from 'components/semantic/Message';


const PathItem = ({ pathInfo, downloadHandler }) => (
  <div className="item">
    <i className="yellow folder icon"/>
    <div className="content">
      <a onClick={ evt => downloadHandler(pathInfo.path) }>
        { pathInfo.path }
        <span className="disk-info">
          { pathInfo.free_space > 0 && ' (' + ValueFormat.formatSize(pathInfo.free_space) + ' free)' }
        </span>
      </a>
    </div>
  </div>
);

const PathList = DataProviderDecorator(({ downloadHandler, pathInfos }) => (
  <div className="ui relaxed list">
    { pathInfos.map(pathInfo => (
      <PathItem 
        key={ pathInfo.path } 
        pathInfo={ pathInfo } 
        downloadHandler={ downloadHandler }
      />
    )) }
  </div>
), {
  urls: {
    pathInfos: ({ paths }, socket) => socket.post(FilesystemConstants.DISK_INFO_URL, { paths }),
  },
});

PathList.PropTypes = {
  /**
	 * Function handling the path selection. Receives the selected path as argument.
	 */
  downloadHandler: PropTypes.func.isRequired,

  /**
	 * Array of paths to list
	 */
  paths: PropTypes.array.isRequired,
};

export default (props) => {
  if (props.paths.length === 0) {
    return (
      <Message
        title="No paths to display"
      />
    );
  }

  return <PathList { ...props }/>;
};