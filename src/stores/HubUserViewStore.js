import ViewStoreMixin from 'mixins/ViewStoreMixin';
import Reflux from 'reflux';
import HubConstants from 'constants/HubConstants';
import HubSessionStore from './HubSessionStore';

export default Reflux.createStore({
  _viewName: 'hub_user_view',
  _apiUrl: HubConstants.SESSIONS_URL,
  _sessionStore: HubSessionStore,
  mixins: [ViewStoreMixin('nick')],
});
