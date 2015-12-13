import Reflux from 'reflux';

import ViewStoreMixin from 'mixins/ViewStoreMixin';
import WebUserConstants from 'constants/WebUserConstants';


export default Reflux.createStore({
	_viewName: 'web_user_view',
	_apiUrl: WebUserConstants.MODULE_URL,
	mixins: [ ViewStoreMixin('username') ],
});
