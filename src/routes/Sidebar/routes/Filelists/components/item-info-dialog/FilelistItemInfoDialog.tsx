import React from 'react';
import Modal from 'components/semantic/Modal';

import FileIcon from 'components/icon/FileIcon';

import DownloadDialog, { DownloadDialogItemDataGetter } from 'components/download/DownloadDialog';

import ModalRouteDecorator, { ModalRouteDecoratorChildProps } from 'decorators/ModalRouteDecorator';
import DataProviderDecorator, { DataProviderDecoratorChildProps } from 'decorators/DataProviderDecorator';
import { RouteComponentProps } from 'react-router-dom';

import * as API from 'types/api';
//import * as UI from 'types/ui';
import { FileItemInfoGrid } from 'components/file-item-info';
import FilelistItemActions from 'actions/reflux/FilelistItemActions';
import FilelistConstants from 'constants/FilelistConstants';


interface FilelistItemInfoDialogProps {
  session: API.FilelistSession;
}

interface DataProps extends DataProviderDecoratorChildProps {
  fileItem: API.FilelistItem;
}

type Props = FilelistItemInfoDialogProps & RouteComponentProps<{ itemId: string; }> & ModalRouteDecoratorChildProps;

export const FilelistItemGetter = (session: API.FilelistSession) => {
  const ret: DownloadDialogItemDataGetter<API.FilelistItem> = (itemId, socket) => {
    return socket.get(`${FilelistConstants.MODULE_URL}/${session.id}/items/${itemId}`);
  };

  return ret;
};

class FilelistItemInfoDialog extends React.Component<Props & DataProps> {
  static displayName = 'FilelistItemInfoDialog';

  render() {
    const { fileItem, session } = this.props;
    return (
      <Modal 
        className="filelist-item" 
        title={ fileItem.name }
        closable={ true } 
        icon={ <FileIcon typeInfo={ fileItem.type }/> } 
        fullHeight={ true }
        { ...this.props }
      >
        <DownloadDialog 
          downloadHandler={ FilelistItemActions.download }
          itemDataGetter={ FilelistItemGetter(session) }
        />
        <FileItemInfoGrid 
          fileItem={ fileItem }
          downloadHandler={ FilelistItemActions.download }
          user={ session.user }
        />
      </Modal>
    );
  }
}

const Decorated = ModalRouteDecorator<FilelistItemInfoDialogProps>(
  DataProviderDecorator<Props, DataProps>(
    FilelistItemInfoDialog, {
      urls: {
        fileItem: ({ match, session }, socket) => FilelistItemGetter(session)(match.params.itemId, socket),
      }
    }
  ), 
  'item/:itemId'
);

export { Decorated as FilelistItemInfoDialog };
