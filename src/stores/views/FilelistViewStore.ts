import ViewStoreMixin from '@/mixins/ViewStoreMixin';
import Reflux from 'reflux';
import FilelistConstants from '@/constants/FilelistConstants';
// import FilelistSessionStore from '../reflux/FilelistSessionStore.ts.tmp';

export default Reflux.createStore({
  _viewName: `${FilelistConstants.VIEW_ID}_view`,
  _apiUrl: FilelistConstants.SESSIONS_URL,
  // _sessionStore: FilelistSessionStore,
  mixins: [ViewStoreMixin('name')],
});
