//import PropTypes from 'prop-types';
import React from 'react';

import FileIcon from 'components/icon/FileIcon';


interface FormattedFileProps {
  onClick?: (() => void) | null;
  typeInfo: API.FilesystemItemType;
  caption: React.ReactNode;
}

const FormattedFile: React.SFC<FormattedFileProps> = ({ onClick, typeInfo, caption }) => {
  if (onClick) {
    caption = (
      <a onClick={ onClick }>
        { caption }
      </a>
    );
  }

  return (
    <div className="file-name">
      <FileIcon typeInfo={ typeInfo }/>
      { caption }
    </div>
  );
};

/*FormattedFile.propTypes = {
  onClick: PropTypes.func,

  typeInfo: PropTypes.object.isRequired,

  caption: PropTypes.node.isRequired,
};*/

export default FormattedFile;