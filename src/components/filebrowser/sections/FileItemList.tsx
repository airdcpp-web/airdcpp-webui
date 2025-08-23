import * as React from 'react';

import FormattedFile from '@/components/format/FormattedFile';

import * as API from '@/types/api';
import * as UI from '@/types/ui';

import { translate } from '@/utils/TranslationUtils';
import { useFormatter } from '@/context/FormatterContext';
import { useTranslation } from 'react-i18next';
import Loader from '@/components/semantic/Loader';
import Message from '@/components/semantic/Message';
import LinkButton from '@/components/semantic/LinkButton';

export type FileItemIconGetter = (item: API.FilesystemItem) => React.ReactNode | null;
export type FileItemClickHandler = (item: API.FilesystemItem) => void;

export interface FileItemProps {
  item: API.FilesystemItem;

  // Function handling the path selection. Receives the selected path as argument.
  itemClickHandler: FileItemClickHandler;

  // Getter for additional content displayed next to file/directory items
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
  const { formatSize } = useFormatter();

  const getClickHandler = () => {
    return isFile && selectMode === UI.FileSelectModeEnum.DIRECTORY
      ? undefined
      : () => itemClickHandler(item);
  };

  return (
    <tr>
      <td>
        <FormattedFile
          typeInfo={item.type}
          caption={<LinkButton onClick={getClickHandler()}>{item.name}</LinkButton>}
          selected={selected}
        />
        {!!itemIconGetter && itemIconGetter(item)}
      </td>
      <td>{!!isFile && formatSize(item.size)}</td>
    </tr>
  );
};

export interface FileItemListProps
  extends Pick<FileItemProps, 'itemClickHandler' | 'itemIconGetter'> {
  items: API.FilesystemItem[] | null;
  error: string | null;
  selectMode: UI.FileSelectModeEnum;
  currentFileName?: string;
}

const sortFileItem = (a: API.FilesystemItem, b: API.FilesystemItem) => {
  if (
    a.type.id !== b.type.id &&
    (a.type.id === 'directory' || b.type.id === 'directory')
  ) {
    return a.type.id === 'directory' ? -1 : 1;
  }

  return a.name.localeCompare(b.name);
};

const FileItemList: React.FC<FileItemListProps> = ({
  items,
  itemClickHandler,
  itemIconGetter,
  selectMode,
  error,
  currentFileName,
}) => {
  const { t } = useTranslation();
  if (error) {
    return (
      <div className="table-container">
        <Message
          isError={true}
          title={translate('Failed to load content', t, UI.Modules.COMMON)}
          description={error}
        />
      </div>
    );
  }

  return (
    <div className="table-container">
      {!items ? (
        <Loader text={translate('Loading items', t, UI.Modules.COMMON)} />
      ) : (
        <table className="ui striped compact table">
          <thead>
            <tr>
              <th>{translate('Name', t, UI.Modules.COMMON)}</th>
              <th>{translate('Size', t, UI.Modules.COMMON)}</th>
            </tr>
          </thead>
          <tbody>
            {items
              .slice()
              .sort(sortFileItem)
              .map((item) => (
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
      )}
    </div>
  );
};

export default FileItemList;
