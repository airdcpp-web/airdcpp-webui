import { Component } from 'react';
import RouteModal from '@/components/semantic/RouteModal';

import ModalRouteDecorator, {
  ModalRouteDecoratorChildProps,
} from '@/decorators/ModalRouteDecorator';

import FileIcon from '@/components/icon/FileIcon';
import BundleFileTable from '@/routes/Queue/components/file-dialog/BundleFileTable';
import DataProviderDecorator, {
  DataProviderDecoratorChildProps,
} from '@/decorators/DataProviderDecorator';
import QueueConstants from '@/constants/QueueConstants';

import * as API from '@/types/api';

interface BundleFileDialogProps {}

interface DataProps extends DataProviderDecoratorChildProps {
  bundle: API.QueueBundle;
}

type Props = BundleFileDialogProps & DataProps & ModalRouteDecoratorChildProps;

class BundleFileDialog extends Component<Props> {
  static readonly displayName = 'BundleFileDialog';

  render() {
    const { bundle } = this.props;
    return (
      <RouteModal
        className="source"
        title={bundle.name}
        subHeader={bundle.target}
        closable={true}
        icon={<FileIcon typeInfo={bundle.type} />}
        fullHeight={true}
      >
        <BundleFileTable bundle={bundle} />
      </RouteModal>
    );
  }
}

export default ModalRouteDecorator<BundleFileDialogProps>(
  DataProviderDecorator<Omit<Props, keyof DataProps>, DataProps>(BundleFileDialog, {
    urls: {
      bundle: ({ params }, socket) =>
        socket.get(`${QueueConstants.BUNDLES_URL}/${params.bundleId}`),
    },
  }),
  'content/:bundleId',
);
