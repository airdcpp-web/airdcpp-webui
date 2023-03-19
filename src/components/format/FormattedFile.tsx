//import PropTypes from 'prop-types';
import * as React from 'react';
import cx from 'classnames';

import FileIcon from 'components/icon/FileIcon';

import * as API from 'types/api';

interface FormattedFileProps {
  onClick?: (() => void) | null;
  typeInfo: API.FilesystemItemType;
  caption: React.ReactNode;
  selected?: boolean;
}

const FormattedFile: React.FC<FormattedFileProps> = ({
  onClick,
  typeInfo,
  caption,
  selected,
}) => {
  if (onClick) {
    caption = <a onClick={onClick}>{caption}</a>;
  }

  const className = cx('file-name', { selected: selected });

  return (
    <div className={className}>
      <FileIcon typeInfo={typeInfo} />
      {caption}
    </div>
  );
};

/*FormattedFile.propTypes = {
  onClick: PropTypes.func,

  typeInfo: PropTypes.object.isRequired,

  caption: PropTypes.node.isRequired,
};*/

export default FormattedFile;
