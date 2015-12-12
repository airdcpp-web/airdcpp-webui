import ViewStoreMixin from 'mixins/ViewStoreMixin';
import Reflux from 'reflux';
import FilelistConstants from 'constants/FilelistConstants';

export default Reflux.createStore({
	_viewName: 'filelist_view',
	_apiUrl: FilelistConstants.SESSION_URL,
	mixins: [ ViewStoreMixin('name') ],
});
