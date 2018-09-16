import React from 'react';
import Modal from 'components/semantic/Modal';

import ModalRouteDecorator, { ModalRouteDecoratorChildProps } from 'decorators/ModalRouteDecorator';
import OverlayConstants from 'constants/OverlayConstants';

import FileIcon from 'components/icon/FileIcon';

import SourceTable from 'routes/Queue/components/BundleSourceTable';
import DataProviderDecorator, { DataProviderDecoratorChildProps } from 'decorators/DataProviderDecorator';
import { RouteComponentProps } from 'react-router';
import QueueConstants from 'constants/QueueConstants';


interface BundleSourceDialogProps {

}

interface DataProps extends DataProviderDecoratorChildProps {
  bundle: API.QueueBundle;
}

type Props = RouteComponentProps<{ bundleId: string; }> & ModalRouteDecoratorChildProps;

class SourceDialog extends React.Component<Props & DataProps> {
  static displayName = 'SourceDialog';

  render() {
    const { bundle } = this.props;
    return (
      <Modal 
        className="source" 
        title={ bundle.name }
        closable={ true } 
        icon={ <FileIcon typeInfo={ bundle.type }/> } 
        fullHeight={ true }
        { ...this.props }
      >
        <SourceTable 
          bundle={ bundle }
        />
      </Modal>
    );
  }
}

export default ModalRouteDecorator<BundleSourceDialogProps>(
  DataProviderDecorator<Props, DataProps>(
    SourceDialog, {
      urls: {
        bundle: ({ match }, socket) => socket.get(`${QueueConstants.BUNDLES_URL}/${match.params.bundleId}`),
      }
    }
  ), 
  OverlayConstants.BUNDLE_SOURCE_MODAL, 
  'sources/:bundleId'
);