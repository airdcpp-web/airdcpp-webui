import ViewStoreMixin from 'mixins/ViewStoreMixin';
import Reflux from 'reflux';
import HubConstants from 'constants/HubConstants';

export default Reflux.createStore({
  _viewName: 'hub_user_view',
  _apiUrl: HubConstants.SESSIONS_URL,
  mixins: [ ViewStoreMixin('nick') ],
});
