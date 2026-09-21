import Reflux from 'reflux';

import ViewStoreMixin from '@/mixins/ViewStoreMixin';
import ShareRootConstants from '@/constants/ShareRootConstants';

export default Reflux.createStore({
  _viewName: `${ShareRootConstants.VIEW_ID}_view`,
  _apiUrl: ShareRootConstants.MODULE_URL,
  mixins: [ViewStoreMixin('path')],
});
