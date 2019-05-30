import React from 'react';
import Modal from 'components/semantic/Modal';

import FileIcon from 'components/icon/FileIcon';

import DownloadDialog, { DownloadDialogItemDataGetter } from 'components/download/DownloadDialog';

import UserResultTable from './UserResultTable';

import ModalRouteDecorator, { ModalRouteDecoratorChildProps } from 'decorators/ModalRouteDecorator';
import DataProviderDecorator, { DataProviderDecoratorChildProps } from 'decorators/DataProviderDecorator';
import SearchConstants from 'constants/SearchConstants';

import * as API from 'types/api';
import * as UI from 'types/ui';
import { FileItemInfoGrid } from 'components/file-item-info';
import { searchDownloadHandler } from 'services/api/SearchApi';


interface ResultDialogProps {
  searchT: UI.ModuleTranslator;
}

interface DataProps extends DataProviderDecoratorChildProps {
  parentResult: API.GroupedSearchResult;
}

interface RouteProps {
  resultId: string;
}

type Props = ResultDialogProps & ModalRouteDecoratorChildProps<RouteProps>;

export const SearchResultGetter: DownloadDialogItemDataGetter<API.GroupedSearchResult> = (itemId, socket) => {
  return socket.get(`${SearchConstants.RESULTS_URL}/${itemId}`);
};

class ResultDialog extends React.Component<Props & DataProps> {
  static displayName = 'ResultDialog';

  render() {
    const { parentResult } = this.props;
    return (
      <Modal 
        className="result" 
        title={ parentResult.name }
        closable={ true } 
        icon={ <FileIcon typeInfo={ parentResult.type }/> } 
        fullHeight={ true }
        { ...this.props }
      >
        <DownloadDialog 
          downloadHandler={ searchDownloadHandler }
          itemDataGetter={ SearchResultGetter }
        />
        <FileItemInfoGrid 
          fileItem={ parentResult }
          downloadHandler={ searchDownloadHandler }
          user={ parentResult.users.user }
          showPath={ false }
        />
        <UserResultTable parentResult={ parentResult }/>
      </Modal>
    );
  }
}

const Decorated = ModalRouteDecorator<ResultDialogProps, RouteProps>(
  DataProviderDecorator<Props, DataProps>(
    ResultDialog, {
      urls: {
        parentResult: ({ match }, socket) => SearchResultGetter(match.params.resultId, socket),
      }
    }
  ), 
  'result/:resultId'
);

export { Decorated as ResultDialog };
