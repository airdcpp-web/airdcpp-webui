import {FAVORITE_HUB_MODULE_URL} from '../constants/FavoriteHubConstants';
//import BaseStore from './BaseStore';
import ViewStoreMixin from '../mixins/ViewStoreMixin'
import Reflux from 'reflux';

//var QueueUtils = require('../utils/QueueUtils');

export default Reflux.createStore({
    _viewName: "favorite_hub_view",
    _apiUrl: FAVORITE_HUB_MODULE_URL,
    mixins: [ViewStoreMixin],
    init: function() {
      
    },

    storeMethod: function() {
        
    }
});
