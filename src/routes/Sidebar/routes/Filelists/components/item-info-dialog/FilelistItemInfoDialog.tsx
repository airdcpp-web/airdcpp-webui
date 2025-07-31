import { Component } from 'react';
import RouteModal from '@/components/semantic/RouteModal';

import FileIcon from '@/components/icon/FileIcon';

import DownloadDialog from '@/components/download/DownloadDialog';

import ModalRouteDecorator, {
  ModalRouteDecoratorChildProps,
} from '@/decorators/ModalRouteDecorator';
import DataProviderDecorator, {
  DataProviderDecoratorChildProps,
} from '@/decorators/DataProviderDecorator';

import * as API from '@/types/api';
import * as UI from '@/types/ui';

import { FileItemInfoGrid } from '@/components/file-item-info';
import FilelistConstants from '@/constants/FilelistConstants';
import { filelistDownloadHandler } from '@/services/api/FilelistApi';

interface FilelistItemInfoDialogProps {
  filelist: API.FilelistSession;
}

interface DataProps extends DataProviderDecoratorChildProps {
  fileItem: API.FilelistItem;
}

type Props = FilelistItemInfoDialogProps & ModalRouteDecoratorChildProps;

export const FilelistItemGetter = (filelist: API.FilelistSession) => {
  const ret: UI.DownloadItemDataGetter<API.FilelistItem> = (itemId, socket) => {
    return socket.get(`${FilelistConstants.MODULE_URL}/${filelist.id}/items/${itemId}`);
  };

  return ret;
};

class FilelistItemInfoDialog extends Component<Props & DataProps> {
  static readonly displayName = 'FilelistItemInfoDialog';

  render() {
    const { fileItem, filelist } = this.props;
    return (
      <RouteModal
        className="filelist-item"
        title={fileItem.name}
        closable={true}
        icon={<FileIcon typeInfo={fileItem.type} />}
        fullHeight={true}
        {...this.props}
      >
        <DownloadDialog
          downloadHandler={filelistDownloadHandler}
          itemDataGetter={FilelistItemGetter(filelist)}
          userGetter={() => filelist.user}
          sessionItem={filelist}
        />
        <FileItemInfoGrid
          fileItem={fileItem}
          downloadHandler={filelistDownloadHandler}
          user={filelist.user}
          sessionItem={filelist}
        />
      </RouteModal>
    );
  }
}

const Decorated = ModalRouteDecorator<FilelistItemInfoDialogProps>(
  DataProviderDecorator<Props, DataProps>(FilelistItemInfoDialog, {
    urls: {
      fileItem: ({ params, filelist }, socket) =>
        FilelistItemGetter(filelist)(params.itemId!, socket),
    },
  }),
  'item/:itemId',
);

export { Decorated as FilelistItemInfoDialog };
