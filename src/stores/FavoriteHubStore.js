import { FAVORITE_HUB_MODULE_URL } from 'constants/FavoriteHubConstants';
import ViewStoreMixin from 'mixins/ViewStoreMixin';
import Reflux from 'reflux';

export default Reflux.createStore({
	_viewName: 'favorite_hub_view',
	_apiUrl: FAVORITE_HUB_MODULE_URL,
	mixins: [ ViewStoreMixin ],
	init: function () {
		
	},

	storeMethod: function () {
			
	}
});
