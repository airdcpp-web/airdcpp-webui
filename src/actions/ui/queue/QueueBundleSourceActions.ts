import { default as QueueConstants } from 'constants/QueueConstants';
import SocketService from 'services/SocketService';

import IconConstants from 'constants/IconConstants';

import * as API from 'types/api';
import * as UI from 'types/ui';

/*interface ActionBundleSourceData {
  source: API.QueueBundleSource;
  bundle: API.QueueBundle;
}*/

type ActionHandlerType = UI.ActionHandler<API.QueueBundleSource, API.QueueBundle>;

const handleRemoveBundleSource: ActionHandlerType = ({
  itemData: source,
  entity: bundle,
}) => {
  return SocketService.delete(
    `${QueueConstants.BUNDLES_URL}/${bundle.id}/sources/${source.user.cid}`,
  );
};

export const QueueBundleSourceRemoveAction = {
  id: 'removeBundleSource',
  displayName: 'Remove source',
  access: API.AccessEnum.QUEUE_EDIT,
  icon: IconConstants.REMOVE,
  handler: handleRemoveBundleSource,
};

const BundleSourceActions = {
  removeBundleSource: QueueBundleSourceRemoveAction,
};

export const QueueBundleSourceActionModule = {
  moduleId: UI.Modules.QUEUE,
  subId: 'bundleSource',
};

export const QueueBundleSourceActionMenu = {
  moduleData: QueueBundleSourceActionModule,
  actions: BundleSourceActions,
};
