'use strict';
//@ts-ignore
import Reflux from 'reflux';
import EventConstants from 'constants/EventConstants';
import SocketService from 'services/SocketService';

import * as UI from 'types/ui';


export const EventActionConfig: UI.RefluxActionConfigList<{}> = [
  { 'fetchMessages': { asyncResult: true } },
  { 'fetchInfo': { asyncResult: true } },
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

EventActions.setRead.listen(function () {
  return SocketService.post(EventConstants.READ_URL);
});


//export default {
//  moduleId: UI.Modules.EVENTS,
//  actions: EventActions,
//};

export default EventActions as UI.RefluxActionListType<void>;
