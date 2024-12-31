import * as React from 'react';
import cx from 'classnames';

import FileIcon from 'components/icon/FileIcon';

import * as API from 'types/api';
import LinkButton from 'components/semantic/LinkButton';

interface FormattedFileProps {
  onClick?: (() => void) | null;
  typeInfo: API.FilesystemItemType;
  caption: React.ReactNode;
  selected?: boolean;
  className?: string;
  linkColor?: string;
}

const FormattedFile: React.FC<FormattedFileProps> = ({
  onClick,
  typeInfo,
  caption,
  selected,
  className,
  linkColor,
}) => {
  if (onClick) {
    caption = <LinkButton onClick={onClick} color={linkColor} caption={caption} />;
  }

  return (
    <div className={cx('file-name', className, { selected: selected })}>
      <FileIcon typeInfo={typeInfo} />
      {caption}
    </div>
  );
};

export default FormattedFile;
