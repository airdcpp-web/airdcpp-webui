import { Component } from 'react';
import RouteModal from '@/components/semantic/RouteModal';

import ModalRouteDecorator, {
  ModalRouteDecoratorChildProps,
} from '@/decorators/ModalRouteDecorator';

import FileIcon from '@/components/icon/FileIcon';

import SourceTable from '@/routes/Queue/components/BundleSourceTable';
import DataProviderDecorator, {
  DataProviderDecoratorChildProps,
} from '@/decorators/DataProviderDecorator';
import QueueConstants from '@/constants/QueueConstants';

import * as API from '@/types/api';
import * as UI from '@/types/ui';

interface BundleSourceDialogProps {
  queueT: UI.ModuleTranslator;
}

interface DataProps extends DataProviderDecoratorChildProps {
  bundle: API.QueueBundle;
}

type Props = BundleSourceDialogProps & ModalRouteDecoratorChildProps;

class SourceDialog extends Component<Props & DataProps> {
  static readonly displayName = 'SourceDialog';

  render() {
    const { bundle, queueT } = this.props;
    return (
      <RouteModal
        className="source"
        title={bundle.name}
        subHeader={bundle.target}
        closable={true}
        icon={<FileIcon typeInfo={bundle.type} />}
        fullHeight={true}
        {...this.props}
      >
        <SourceTable bundle={bundle} queueT={queueT} />
      </RouteModal>
    );
  }
}

export default ModalRouteDecorator<BundleSourceDialogProps>(
  DataProviderDecorator<Props, DataProps>(SourceDialog, {
    urls: {
      bundle: ({ params }, socket) =>
        socket.get(`${QueueConstants.BUNDLES_URL}/${params.bundleId}`),
    },
  }),
  'sources/:bundleId',
);
