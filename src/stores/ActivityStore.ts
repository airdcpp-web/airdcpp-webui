//@ts-ignore
import Reflux from 'reflux';

import { default as SystemConstants, AwayEnum } from 'constants/SystemConstants';

import ActivityActions from 'actions/reflux/ActivityActions';
import SystemActions from 'actions/reflux/SystemActions';

import SocketSubscriptionDecorator from './decorators/SocketSubscriptionDecorator';
import { AddListener } from 'airdcpp-apisocket';


export interface ActivityState {
  away: AwayEnum;
  userActive: boolean;
}

const ActivityStore = Reflux.createStore({
  listenables: [ ActivityActions, SystemActions ],
  _away: AwayEnum.OFF,
  _userActive: false,

  init() {
    this.getInitialState = this.getState;
  },

  getState(): ActivityState {
    return {
      away: this._away,
      userActive: this._userActive,
    };
  },

  onUserActiveChanged(active: boolean) {
    // console.log('onUserActiveChanged', active);
    this._userActive = active;
    this.trigger(this.getState());
  },

  onFetchAwayCompleted(data: { id: AwayEnum }) {
    this._away = data.id;
    this.trigger(this.getState());
  },

  get away() {
    return this._away;
  },

  get userActive() {
    return this._userActive;
  },

  onSocketConnected(addSocketListener: AddListener) {
    const url = SystemConstants.MODULE_URL;
    addSocketListener(url, SystemConstants.AWAY_STATE, this.onFetchAwayCompleted);
  }
});

export default SocketSubscriptionDecorator(ActivityStore);
