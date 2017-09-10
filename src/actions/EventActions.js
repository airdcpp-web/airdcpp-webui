'use strict';
import Reflux from 'reflux';
import EventConstants from 'constants/EventConstants';
import SocketService from 'services/SocketService';
import AccessConstants from 'constants/AccessConstants';

export const EventActions = Reflux.createActions([
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
]);

EventActions.fetchInfo.listen(function () {
  let that = this;
  return SocketService.get(EventConstants.INFO_URL)
    .then(that.completed)
    .catch(that.failed);
});

EventActions.fetchMessages.listen(function () {
  let that = this;
  return SocketService.get(EventConstants.MESSAGES_URL + '/0')
    .then(that.completed)
    .catch(that.failed);
});

EventActions.clear.listen(function () {
  return SocketService.delete(EventConstants.MESSAGES_URL);
});

EventActions.setRead.listen(function () {
  return SocketService.post(EventConstants.READ_URL);
});

export default EventActions;
