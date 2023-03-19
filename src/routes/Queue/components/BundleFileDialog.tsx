import { Component } from 'react';
import Modal from 'components/semantic/Modal';

import ModalRouteDecorator, {
  ModalRouteDecoratorChildProps,
} from 'decorators/ModalRouteDecorator';

import FileIcon from 'components/icon/FileIcon';
import BundleFileTable from 'routes/Queue/components/BundleFileTable';
import DataProviderDecorator, {
  DataProviderDecoratorChildProps,
} from 'decorators/DataProviderDecorator';
import QueueConstants from 'constants/QueueConstants';

import * as API from 'types/api';

interface BundleFileDialogProps {}

interface DataProps extends DataProviderDecoratorChildProps {
  bundle: API.QueueBundle;
}

interface RouteProps {
  bundleId: string;
}

type Props = BundleFileDialogProps &
  DataProps &
  ModalRouteDecoratorChildProps<RouteProps>;

class BundleFileDialog extends Component<Props> {
  static displayName = 'BundleFileDialog';

  render() {
    const { bundle, ...other } = this.props;
    return (
      <Modal
        className="source"
        title={bundle.name}
        subHeader={bundle.target}
        closable={true}
        icon={<FileIcon typeInfo={bundle.type} />}
        fullHeight={true}
        {...other}
      >
        <BundleFileTable bundle={bundle} />
      </Modal>
    );
  }
}

export default ModalRouteDecorator<BundleFileDialogProps, RouteProps>(
  DataProviderDecorator<Omit<Props, keyof DataProps>, DataProps>(BundleFileDialog, {
    urls: {
      bundle: ({ match }, socket) =>
        socket.get(`${QueueConstants.BUNDLES_URL}/${match.params.bundleId}`),
    },
  }),
  'content/:bundleId'
);
