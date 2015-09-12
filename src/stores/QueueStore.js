import {QUEUE_MODULE_URL} from '../constants/QueueConstants';
import ViewStoreMixin from '../mixins/ViewStoreMixin'
import Reflux from 'reflux';

export default Reflux.createStore({
    _viewName: "bundle_view",
    _apiUrl: QUEUE_MODULE_URL,
    mixins: [ViewStoreMixin],
    init: function() {
      
    },

    storeMethod: function() {
        
    }
});