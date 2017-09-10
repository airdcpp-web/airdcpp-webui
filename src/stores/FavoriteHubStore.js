import Reflux from 'reflux';

import FavoriteHubConstants from 'constants/FavoriteHubConstants';
import ViewStoreMixin from 'mixins/ViewStoreMixin';


export default Reflux.createStore({
  _viewName: 'favorite_hub_view',
  _apiUrl: FavoriteHubConstants.MODULE_URL,
  mixins: [ ViewStoreMixin('name') ],
});
