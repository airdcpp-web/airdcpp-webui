'use strict';
//@ts-ignore
import Reflux from 'reflux';
import EventConstants from 'constants/EventConstants';
import SocketService from 'services/SocketService';
import AccessConstants from 'constants/AccessConstants';

import * as UI from 'types/ui';


export const EventActionConfig: UI.ActionConfigList<{}> = [
  { 'fetchMessages': { asyncResult: true } },
  { 'fetchInfo': { asyncResult: true } },
  { 'clear': {
    asyncResult: true,
    displayName: 'Clear',
    access: AccessConstants.EVENTS_EDIT,
    //icon: IconConstants.CREATE 
  } },
  'setRead',
  'setActive',
  'resetLogCounters'
];

const EventActions = Reflux.createActions(EventActionConfig);

EventActions.fetchInfo.listen(function (
  this: UI.AsyncActionType<{}>
) {
  let that = this;
  return SocketService.get(EventConstants.INFO_URL)
    .then(that.completed)
    .catch(that.failed);
});

EventActions.fetchMessages.listen(function (
  this: UI.AsyncActionType<{}>
) {
  let that = this;
  return SocketService.get(`${EventConstants.MESSAGES_URL}/0`)
    .then(that.completed)
    .catch(that.failed);
});

EventActions.clear.listen(function () {
  return SocketService.delete(EventConstants.MESSAGES_URL);
});

EventActions.setRead.listen(function () {
  return SocketService.post(EventConstants.READ_URL);
});


export default {
  moduleId: UI.Modules.EVENTS,
  actions: EventActions,
};
