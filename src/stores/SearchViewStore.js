import Reflux from 'reflux';

import ViewStoreMixin from 'mixins/ViewStoreMixin';


export default Reflux.createStore({
	_viewName: 'search_view',
	_apiUrl: 'search/v0',
	mixins: [ ViewStoreMixin('relevance', false) ],
});
