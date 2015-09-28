'use strict';
import Reflux from 'reflux';

export const NotificationActions = Reflux.createActions([
  "success",
  "info",
  "warning",
  "error"
]);

export default NotificationActions;