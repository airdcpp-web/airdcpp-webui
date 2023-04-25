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
  className?: string;
}

const FormattedFile: React.FC<FormattedFileProps> = ({
  onClick,
  typeInfo,
  caption,
  selected,
  className,
}) => {
  if (onClick) {
    caption = <a onClick={onClick}>{caption}</a>;
  }

  return (
    <div className={cx('file-name', className, { selected: selected })}>
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
