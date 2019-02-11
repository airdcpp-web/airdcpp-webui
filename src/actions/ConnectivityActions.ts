'use strict';
//@ts-ignore
import Reflux from 'reflux';

import SocketService from 'services/SocketService';

import AccessConstants from 'constants/AccessConstants';
import ConnectivityConstants from 'constants/ConnectivityConstants';

import * as UI from 'types/ui';


const ConnectivityActionConfig: UI.ActionConfigList<{}> = [
  { 'detect': { 
    asyncResult: true,
    displayName: 'Detect now',
    access: AccessConstants.SETTINGS_EDIT,
    icon: 'gray configure',
  } },
];


const ConnectivityActions = Reflux.createActions(ConnectivityActionConfig);

ConnectivityActions.detect.listen(function (
  this: UI.AsyncActionType<{}>
) {
  const that = this;
  return SocketService.post(ConnectivityConstants.DETECT_URL)
    .then(that.completed.bind(that))
    .catch(that.failed.bind(that));
});


export default {
  moduleId: UI.Modules.SETTINGS,
  actions: ConnectivityActions,
};
