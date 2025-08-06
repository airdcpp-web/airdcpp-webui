import Reflux from 'reflux';

import SearchConstants from '@/constants/SearchConstants';
import ViewStoreMixin from '@/mixins/ViewStoreMixin';

export default Reflux.createStore({
  _viewName: `${SearchConstants.VIEW_ID}_view`,
  _apiUrl: SearchConstants.INSTANCES_URL,
  mixins: [ViewStoreMixin('relevance', false)],
});
