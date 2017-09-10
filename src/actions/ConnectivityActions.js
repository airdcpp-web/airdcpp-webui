'use strict';
import Reflux from 'reflux';

import SocketService from 'services/SocketService';

import AccessConstants from 'constants/AccessConstants';
import ConnectivityConstants from 'constants/ConnectivityConstants';


const ConnectivityActions = Reflux.createActions([
  { 'detect': { 
    asyncResult: true,
    displayName: 'Detect now',
    access: AccessConstants.SETTINGS_EDIT,
    icon: 'gray configure',
  } },
]);

ConnectivityActions.detect.listen(function () {
  const that = this;
  return SocketService.post(ConnectivityConstants.DETECT_URL)
    .then(that.completed.bind(that))
    .catch(that.failed.bind(that));
});

export default ConnectivityActions;
