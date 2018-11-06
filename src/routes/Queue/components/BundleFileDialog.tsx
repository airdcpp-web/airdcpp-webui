import React from 'react';
import Modal from 'components/semantic/Modal';

import ModalRouteDecorator, { ModalRouteDecoratorChildProps } from 'decorators/ModalRouteDecorator';

import FileIcon from 'components/icon/FileIcon';
import BundleFileTable from 'routes/Queue/components/BundleFileTable';
import DataProviderDecorator, { DataProviderDecoratorChildProps } from 'decorators/DataProviderDecorator';
import { RouteComponentProps } from 'react-router-dom';
import QueueConstants from 'constants/QueueConstants';

import * as API from 'types/api';


interface BundleFileDialogProps {

}

interface DataProps extends DataProviderDecoratorChildProps {
  bundle: API.QueueBundle;
}

type Props = BundleFileDialogProps & DataProps & 
  RouteComponentProps<{ bundleId: string; }> & ModalRouteDecoratorChildProps;

class BundleFileDialog extends React.Component<Props> {
  static displayName = 'BundleFileDialog';

  render() {
    const { bundle, ...other } = this.props;
    return (
      <Modal 
        className="source" 
        title={ bundle.name }
        closable={ true } 
        icon={ <FileIcon typeInfo={ bundle.type }/> } 
        fullHeight={ true }
        { ...other }
      >
        <BundleFileTable 
          bundle={ bundle }
        />
      </Modal>
    );
  }
}

export default ModalRouteDecorator<BundleFileDialogProps>(
  DataProviderDecorator<Props, DataProps>(
    BundleFileDialog, {
      urls: {
        bundle: ({ match }, socket) => socket.get(`${QueueConstants.BUNDLES_URL}/${match.params.bundleId}`),
      }
    }
  ), 
  'content/:bundleId'
);