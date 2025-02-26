import Reflux from 'reflux';

import ViewStoreMixin from '@/mixins/ViewStoreMixin';
import ShareRootConstants from '@/constants/ShareRootConstants';

export default Reflux.createStore({
  _viewName: 'share_root_view',
  _apiUrl: ShareRootConstants.MODULE_URL,
  mixins: [ViewStoreMixin('path')],
});
