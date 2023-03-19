import Reflux from 'reflux';

import SearchConstants from 'constants/SearchConstants';
import ViewStoreMixin from 'mixins/ViewStoreMixin';

export default Reflux.createStore({
  _viewName: 'search_view',
  _apiUrl: SearchConstants.INSTANCES_URL,
  mixins: [ViewStoreMixin('relevance', false)],
});
