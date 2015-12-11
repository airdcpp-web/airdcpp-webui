import ViewStoreMixin from 'mixins/ViewStoreMixin';
import Reflux from 'reflux';
import { FILELIST_SESSION_URL } from 'constants/FilelistConstants';

export default Reflux.createStore({
	_viewName: 'filelist_view',
	_apiUrl: FILELIST_SESSION_URL,
	mixins: [ ViewStoreMixin('name') ],
	init: function () {
		
	},
});
