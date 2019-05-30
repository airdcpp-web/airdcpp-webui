import React from 'react';
import Modal from 'components/semantic/Modal';

import ModalRouteDecorator, { ModalRouteDecoratorChildProps } from 'decorators/ModalRouteDecorator';

import FileIcon from 'components/icon/FileIcon';

import SourceTable from 'routes/Queue/components/BundleSourceTable';
import DataProviderDecorator, { DataProviderDecoratorChildProps } from 'decorators/DataProviderDecorator';
import QueueConstants from 'constants/QueueConstants';

import * as API from 'types/api';
import * as UI from 'types/ui';


interface BundleSourceDialogProps {
  queueT: UI.ModuleTranslator;
}

interface DataProps extends DataProviderDecoratorChildProps {
  bundle: API.QueueBundle;
}

interface RouteProps { 
  bundleId: string; 
}

type Props = BundleSourceDialogProps & ModalRouteDecoratorChildProps<RouteProps>;

class SourceDialog extends React.Component<Props & DataProps> {
  static displayName = 'SourceDialog';

  render() {
    const { bundle, queueT } = this.props;
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
          queueT={ queueT }
        />
      </Modal>
    );
  }
}

export default ModalRouteDecorator<BundleSourceDialogProps, RouteProps>(
  DataProviderDecorator<Props, DataProps>(
    SourceDialog, {
      urls: {
        bundle: ({ match }, socket) => socket.get(`${QueueConstants.BUNDLES_URL}/${match.params.bundleId}`),
      }
    }
  ),  
  'sources/:bundleId'
);