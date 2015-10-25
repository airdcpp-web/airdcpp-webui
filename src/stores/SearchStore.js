import ViewStoreMixin from 'mixins/ViewStoreMixin'
import Reflux from 'reflux';

export default Reflux.createStore({
	_viewName: "search_view",
	_apiUrl: "search/v0",
	mixins: [ViewStoreMixin],
	init: function() {
		
	},

	storeMethod: function() {
			
	}
});