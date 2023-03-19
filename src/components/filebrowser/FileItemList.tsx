import PropTypes from 'prop-types';
import * as React from 'react';

import FormattedFile from 'components/format/FormattedFile';
import { formatSize } from 'utils/ValueFormat';

import * as API from 'types/api';
import * as UI from 'types/ui';

import { translate } from 'utils/TranslationUtils';

export type FileItemIconGetter = (item: API.FilesystemItem) => React.ReactNode | null;
export type FileItemClickHandler = (item: API.FilesystemItem) => void;

export interface FileItemProps {
  item: API.FilesystemItem;
  itemClickHandler: FileItemClickHandler;
  itemIconGetter?: FileItemIconGetter;
  t: UI.TranslateF;
  selectMode: UI.FileSelectModeEnum;
  selected?: boolean;
}

const FileItem: React.FC<FileItemProps> = ({
  item,
  itemClickHandler,
  itemIconGetter,
  t,
  selectMode,
  selected,
}) => {
  const isFile = item.type.id === 'file';
  return (
    <tr>
      <td>
        <FormattedFile
          typeInfo={item.type}
          onClick={
            isFile && selectMode === UI.FileSelectModeEnum.DIRECTORY
              ? null
              : () => itemClickHandler(item)
          }
          caption={item.name}
          selected={selected}
        />
        {!!itemIconGetter && itemIconGetter(item)}
      </td>
      <td>{!!isFile && formatSize(item.size, t)}</td>
    </tr>
  );
};

export interface FileItemListProps
  extends Pick<FileItemProps, 'itemClickHandler' | 'itemIconGetter'> {
  items: API.FilesystemItem[];
  t: UI.TranslateF;
  selectMode: UI.FileSelectModeEnum;
  currentFileName?: string;
}

class FileItemList extends React.Component<FileItemListProps> {
  static propTypes = {
    // Function handling the path selection. Receives the selected path as argument.
    itemClickHandler: PropTypes.func.isRequired,

    // Function handling the path selection. Receives the selected path as argument.
    itemIconGetter: PropTypes.func,

    // Array of path objects to list
    items: PropTypes.array.isRequired,
  };

  sort = (a: API.FilesystemItem, b: API.FilesystemItem) => {
    if (
      a.type.id !== b.type.id &&
      (a.type.id === 'directory' || b.type.id === 'directory')
    ) {
      return a.type.id === 'directory' ? -1 : 1;
    }

    return a.name.localeCompare(b.name);
  };

  render() {
    const { items, itemClickHandler, itemIconGetter, t, selectMode, currentFileName } =
      this.props;
    return (
      <div className="table-container">
        <table className="ui striped compact table">
          <thead>
            <tr>
              <th>{translate('Name', t, UI.Modules.COMMON)}</th>
              <th>{translate('Size', t, UI.Modules.COMMON)}</th>
            </tr>
          </thead>
          <tbody>
            {items.sort(this.sort).map((item) => (
              <FileItem
                key={item.name}
                selectMode={selectMode}
                item={item}
                itemClickHandler={itemClickHandler}
                itemIconGetter={itemIconGetter}
                selected={item.name === currentFileName}
                t={t}
              />
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}

export default FileItemList;
