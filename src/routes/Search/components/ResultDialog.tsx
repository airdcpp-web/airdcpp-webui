import React from 'react';
import Modal from 'components/semantic/Modal';

import FileIcon from 'components/icon/FileIcon';

import DownloadDialog from 'components/download/DownloadDialog';
import SearchActions from 'actions/SearchActions';

import ResultInfoGrid from 'routes/Search/components/ResultInfoGrid';
import UserResultTable from 'routes/Search/components/UserResultTable';

import ModalRouteDecorator, { ModalRouteDecoratorChildProps } from 'decorators/ModalRouteDecorator';
import OverlayConstants from 'constants/OverlayConstants';
import DataProviderDecorator, { DataProviderDecoratorChildProps } from 'decorators/DataProviderDecorator';
import { RouteComponentProps } from 'react-router';
import SearchConstants from 'constants/SearchConstants';


interface DataProps extends DataProviderDecoratorChildProps {
  parentResult: API.GroupedSearchResult;
}

type Props = RouteComponentProps<{ resultId: string; }> & ModalRouteDecoratorChildProps;

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
        <DownloadDialog downloadHandler={ SearchActions.download }/>
        <ResultInfoGrid parentResult={ parentResult! }/>
        <UserResultTable parentResult={ parentResult! }/>
      </Modal>
    );
  }
}

export default ModalRouteDecorator<{}>(
  DataProviderDecorator<Props, DataProps>(
    ResultDialog, {
      urls: {
        parentResult: ({ match }, socket) => socket.get(`${SearchConstants.RESULTS_URL}/${match.params.resultId}`),
      }
    }
  ), 
  OverlayConstants.SEARCH_RESULT_MODAL, 
  'result/:resultId'
);