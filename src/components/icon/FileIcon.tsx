//import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';

import IconConstants from 'constants/IconConstants';

import * as API from 'types/api';


const fileToIcon = (name: API.FileContentType) => {
  switch (name) {
    case 'audio': return 'file outline audio';
    case 'compressed': return 'file outline archive';
    case 'document': return 'file text outline';
    case 'executable': return 'browser';
    case 'picture': return 'file outline image';
    case 'video': return 'file outline video';
    case 'filelist': return IconConstants.FILELIST;
    default: return 'file outline';
  }
};

const fileItemTypeToIcon = (typeInfo: API.FilesystemItemType) => {
  switch (typeInfo.id) {
    case 'directory': return 'file outline yellow folder';
    case 'file': return fileToIcon(typeInfo.content_type);
    case 'drive_fixed': return 'grey hdd outline';
    case 'drive_remote': return 'grey server';
    case 'removable': return 'grey external share';
    default: return 'file outline';
  }
};

export interface FileIconProps {
  typeInfo: API.FilesystemItemType;
  onClick?: () => void;
}

const FileIcon: React.SFC<FileIconProps> = ({ typeInfo, onClick }) => {
  const iconClass = classNames(
    'icon large',
    { 'link': !!onClick },
    fileItemTypeToIcon(typeInfo),
  );

  return (
    <i className={ iconClass }/>
  );
};

/*FileIcon.propTypes = {
  onClick: PropTypes.func,

  typeInfo: PropTypes.object.isRequired,
};*/

export default FileIcon;