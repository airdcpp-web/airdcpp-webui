import ViewStoreMixin from 'mixins/ViewStoreMixin';
import Reflux from 'reflux';

import { SHARE_MODULE_URL } from 'constants/ShareConstants';

export default Reflux.createStore({
	_viewName: 'share_root_view',
	_apiUrl: SHARE_MODULE_URL,
	mixins: [ ViewStoreMixin ],
	init: function () {
		
	},
});
