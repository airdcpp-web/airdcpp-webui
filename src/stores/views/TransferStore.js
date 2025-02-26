import Reflux from 'reflux';

import TransferConstants from '@/constants/TransferConstants';
import ViewStoreMixin from '@/mixins/ViewStoreMixin';

export default Reflux.createStore({
  _viewName: 'transfer_view',
  _apiUrl: TransferConstants.MODULE_URL,
  mixins: [ViewStoreMixin('user')],
});
