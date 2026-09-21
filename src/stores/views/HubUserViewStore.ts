import ViewStoreMixin from '@/mixins/ViewStoreMixin';
import Reflux from 'reflux';
import HubConstants from '@/constants/HubConstants';
// import HubSessionStore from '../reflux/HubSessionStore.ts.tmp';

export default Reflux.createStore({
  _viewName: `${HubConstants.USER_VIEW_ID}_view`,
  _apiUrl: HubConstants.SESSIONS_URL,
  // _sessionStore: HubSessionStore,
  mixins: [ViewStoreMixin('nick')],
});
