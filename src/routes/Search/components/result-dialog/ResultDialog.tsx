import { Component } from 'react';
import Modal from 'components/semantic/Modal';

import FileIcon from 'components/icon/FileIcon';

import DownloadDialog from 'components/download/DownloadDialog';

import UserResultTable from './UserResultTable';

import ModalRouteDecorator, {
  ModalRouteDecoratorChildProps,
} from 'decorators/ModalRouteDecorator';
import DataProviderDecorator, {
  DataProviderDecoratorChildProps,
} from 'decorators/DataProviderDecorator';
import SearchConstants from 'constants/SearchConstants';

import * as API from 'types/api';
import * as UI from 'types/ui';
import { FileItemInfoGrid } from 'components/file-item-info';
import { searchDownloadHandler } from 'services/api/SearchApi';

interface ResultDialogProps {
  searchT: UI.ModuleTranslator;
  instance: API.SearchInstance;
}

interface DataProps extends DataProviderDecoratorChildProps {
  parentResult: API.GroupedSearchResult;
}

/*interface RouteProps {
  resultId: string;
}*/

type Props = ResultDialogProps & ModalRouteDecoratorChildProps;

class ResultDialog extends Component<Props & DataProps> {
  static displayName = 'ResultDialog';

  itemDataGetter: UI.DownloadItemDataGetter<API.GroupedSearchResult> = (
    itemId,
    socket
  ) => {
    const { instance } = this.props;
    return socket.get(
      `${SearchConstants.INSTANCES_URL}/${instance.id}/results/${itemId}`
    );
  };

  render() {
    const { parentResult, instance } = this.props;
    return (
      <Modal
        className="result"
        title={parentResult.name}
        closable={true}
        icon={<FileIcon typeInfo={parentResult.type} />}
        fullHeight={true}
      >
        <DownloadDialog
          downloadHandler={searchDownloadHandler}
          itemDataGetter={this.itemDataGetter}
          session={instance}
        />
        <FileItemInfoGrid
          fileItem={parentResult}
          downloadHandler={searchDownloadHandler}
          user={parentResult.users.user}
          showPath={false}
          session={instance}
        />
        <UserResultTable parentResult={parentResult} instanceId={instance.id} />
      </Modal>
    );
  }
}

const Decorated = ModalRouteDecorator<ResultDialogProps>(
  DataProviderDecorator<Props, DataProps>(ResultDialog, {
    urls: {
      parentResult: ({ params, instance }, socket) =>
        socket.get(
          `${SearchConstants.INSTANCES_URL}/${instance.id}/results/${params.resultId}`
        ),
    },
  }),
  '/result/:resultId'
);

export { Decorated as ResultDialog };
