import { Component } from 'react';
import Modal from 'components/semantic/Modal';

import FileIcon from 'components/icon/FileIcon';

import DownloadDialog from 'components/download/DownloadDialog';

import ModalRouteDecorator, {
  ModalRouteDecoratorChildProps,
} from 'decorators/ModalRouteDecorator';
import DataProviderDecorator, {
  DataProviderDecoratorChildProps,
} from 'decorators/DataProviderDecorator';

import * as API from 'types/api';
import * as UI from 'types/ui';

import { FileItemInfoGrid } from 'components/file-item-info';
import FilelistConstants from 'constants/FilelistConstants';
import { filelistDownloadHandler } from 'services/api/FilelistApi';

interface FilelistItemInfoDialogProps {
  session: API.FilelistSession;
}

interface DataProps extends DataProviderDecoratorChildProps {
  fileItem: API.FilelistItem;
}

interface RouteProps {
  itemId: string;
}

type Props = FilelistItemInfoDialogProps & ModalRouteDecoratorChildProps<RouteProps>;

export const FilelistItemGetter = (session: API.FilelistSession) => {
  const ret: UI.DownloadItemDataGetter<API.FilelistItem> = (itemId, socket) => {
    return socket.get(`${FilelistConstants.MODULE_URL}/${session.id}/items/${itemId}`);
  };

  return ret;
};

class FilelistItemInfoDialog extends Component<Props & DataProps> {
  static displayName = 'FilelistItemInfoDialog';

  render() {
    const { fileItem, session } = this.props;
    return (
      <Modal
        className="filelist-item"
        title={fileItem.name}
        closable={true}
        icon={<FileIcon typeInfo={fileItem.type} />}
        fullHeight={true}
        {...this.props}
      >
        <DownloadDialog
          downloadHandler={filelistDownloadHandler}
          itemDataGetter={FilelistItemGetter(session)}
          userGetter={() => session.user}
          session={session}
        />
        <FileItemInfoGrid
          fileItem={fileItem}
          downloadHandler={filelistDownloadHandler}
          user={session.user}
          session={session}
        />
      </Modal>
    );
  }
}

const Decorated = ModalRouteDecorator<FilelistItemInfoDialogProps, RouteProps>(
  DataProviderDecorator<Props, DataProps>(FilelistItemInfoDialog, {
    urls: {
      fileItem: ({ match, session }, socket) =>
        FilelistItemGetter(session)(match.params.itemId, socket),
    },
  }),
  'item/:itemId'
);

export { Decorated as FilelistItemInfoDialog };
