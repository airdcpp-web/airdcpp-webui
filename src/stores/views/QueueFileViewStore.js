import Reflux from 'reflux';

import QueueConstants from '@/constants/QueueConstants';
import ViewStoreMixin from '@/mixins/ViewStoreMixin';

export default Reflux.createStore({
  _viewName: `${QueueConstants.FILE_VIEW_ID}_view`,
  _apiUrl: QueueConstants.MODULE_URL,
  mixins: [ViewStoreMixin('name')],
});
