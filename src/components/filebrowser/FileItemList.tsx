import PropTypes from 'prop-types';
import React from 'react';

import FormattedFile from 'components/format/FormattedFile';
import { formatSize } from 'utils/ValueFormat';



export type FileItemIconGetter = (item: API.FilesystemItem) => React.ReactNode | null;
export type FileItemClickHandler = (name: string) => void;

export interface FileItemProps {
  item: API.FilesystemItem;
  itemClickHandler: FileItemClickHandler;
  itemIconGetter?: FileItemIconGetter;
}

const FileItem: React.SFC<FileItemProps> = ({ item, itemClickHandler, itemIconGetter }) => {
  const isFile = item.type.id === 'file';
  return (
    <tr>
      <td>
        <FormattedFile 
          typeInfo={ item.type } 
          onClick={ isFile ? null : () => itemClickHandler(item.name) }
          caption={ item.name }
        />
        { !!itemIconGetter && itemIconGetter(item) }
      </td>
      <td>
        { !!isFile && formatSize(item.size) }
      </td>
    </tr>
  );
};

export interface FileItemListProps extends Pick<FileItemProps, 'itemClickHandler' | 'itemIconGetter'> {
  items: API.FilesystemItem[];
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
    if (a.type.id !== b.type.id && (a.type.id === 'directory' || b.type.id === 'directory')) {
      return a.type.id === 'directory' ? -1 : 1;
    }

    return a.name.localeCompare(b.name);
  }

  render() {
    const { items, itemClickHandler, itemIconGetter } = this.props;
    return (
      <div className="table-container">
        <table className="ui striped compact table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Size</th>
            </tr>
          </thead>
          <tbody>
            { items.sort(this.sort).map(item => (
              <FileItem 
                key={ item.name }
                item={ item }
                itemClickHandler={ itemClickHandler }
                itemIconGetter={ itemIconGetter }
              />
            )) }
          </tbody>
        </table>
      </div>
    );
  }
}

export default FileItemList;