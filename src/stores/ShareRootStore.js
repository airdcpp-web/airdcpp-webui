import ViewStoreMixin from 'mixins/ViewStoreMixin';
import Reflux from 'reflux';

import { SHARE_ROOT_MODULE_URL } from 'constants/ShareRootConstants';

export default Reflux.createStore({
	_viewName: 'share_root_view',
	_apiUrl: SHARE_ROOT_MODULE_URL,
	mixins: [ ViewStoreMixin ],
	init: function () {
		
	},
});
