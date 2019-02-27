'use strict';
import { default as QueueConstants } from 'constants/QueueConstants';
import SocketService from 'services/SocketService';

import IconConstants from 'constants/IconConstants';

import * as API from 'types/api';
import * as UI from 'types/ui';



interface ActionBundleSourceData {
  source: API.QueueBundleSource;
  bundle: API.QueueBundle;
}

const handleRemoveBundleSource: UI.ActionHandler<ActionBundleSourceData> = ({ data }) => {
  const { source, bundle } = data;
  return SocketService.delete(`${QueueConstants.BUNDLES_URL}/${bundle.id}/sources/${source.user.cid}`);
};

const BundleSourceActions: UI.ActionListType<ActionBundleSourceData> = {
  removeBundleSource: {
    access: API.AccessEnum.QUEUE_EDIT, 
    displayName: 'Remove source', 
    icon: IconConstants.REMOVE,
    handler: handleRemoveBundleSource,
  },
};


export default {
  moduleId: UI.Modules.QUEUE,
  subId: 'bundleSource',
  actions: BundleSourceActions,
};
