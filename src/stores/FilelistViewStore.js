import ViewStoreMixin from 'mixins/ViewStoreMixin';
import Reflux from 'reflux';
import FilelistConstants from 'constants/FilelistConstants';
import FilelistSessionStore from './FilelistSessionStore';

export default Reflux.createStore({
  _viewName: 'filelist_view',
  _apiUrl: FilelistConstants.SESSIONS_URL,
  _sessionStore: FilelistSessionStore,
  mixins: [ViewStoreMixin('name')],
});
