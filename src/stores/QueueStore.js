import Reflux from 'reflux';

import QueueConstants from 'constants/QueueConstants';
import ViewStoreMixin from 'mixins/ViewStoreMixin';


export default Reflux.createStore({
	_viewName: 'bundle_view',
	_apiUrl: QueueConstants.QUEUE_MODULE_URL,
	mixins: [ ViewStoreMixin('name') ],
});
