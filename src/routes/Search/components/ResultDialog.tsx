import React from 'react';
import Modal from 'components/semantic/Modal';

import FileIcon from 'components/icon/FileIcon';

import DownloadDialog, { DownloadDialogItemDataGetter } from 'components/download/DownloadDialog';
import SearchActions from 'actions/SearchActions';

import ResultInfoGrid from 'routes/Search/components/ResultInfoGrid';
import UserResultTable from 'routes/Search/components/UserResultTable';

import ModalRouteDecorator, { ModalRouteDecoratorChildProps } from 'decorators/ModalRouteDecorator';
import DataProviderDecorator, { DataProviderDecoratorChildProps } from 'decorators/DataProviderDecorator';
import { RouteComponentProps } from 'react-router-dom';
import SearchConstants from 'constants/SearchConstants';

import * as API from 'types/api';


interface ResultDialogProps {

}

interface DataProps extends DataProviderDecoratorChildProps {
  parentResult: API.GroupedSearchResult;
}

type Props = ResultDialogProps & RouteComponentProps<{ resultId: string; }> & ModalRouteDecoratorChildProps;

export const SearchResultGetter: DownloadDialogItemDataGetter<API.GroupedSearchResult> = (itemId, socket) => {
  return socket.get(`${SearchConstants.RESULTS_URL}/${itemId}`);
};

/*export const SearchResultUserGetter: DownloadDialogUserGetter<API.GroupedSearchResult> = (id, props) => {
  return props.itemInfo.users.user;
};*/

class ResultDialog extends React.Component<Props & DataProps> {
  static displayName = 'ResultDialog';

  render() {
    const { parentResult } = this.props;
    return (
      <Modal 
        className="result" 
        title={ parentResult!.name }
        closable={ true } 
        icon={ <FileIcon typeInfo={ parentResult!.type }/> } 
        fullHeight={ true }
        { ...this.props }
      >
        <DownloadDialog 
          downloadHandler={ SearchActions.actions.download }
          itemDataGetter={ SearchResultGetter }
        />
        <ResultInfoGrid parentResult={ parentResult! }/>
        <UserResultTable parentResult={ parentResult! }/>
      </Modal>
    );
  }
}

export default ModalRouteDecorator<ResultDialogProps>(
  DataProviderDecorator<Props, DataProps>(
    ResultDialog, {
      urls: {
        parentResult: ({ match }, socket) => socket.get(`${SearchConstants.RESULTS_URL}/${match.params.resultId}`),
      }
    }
  ), 
  'result/:resultId'
);