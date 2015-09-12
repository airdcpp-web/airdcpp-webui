import {QUEUE_MODULE_URL} from '../constants/QueueConstants';
//import BaseStore from './BaseStore';
import ViewStoreMixin from '../mixins/ViewStoreMixin'
import SocketStore from './SocketStore'
import Reflux from 'reflux';

//var QueueUtils = require('../utils/QueueUtils');

export default Reflux.createStore({
    _viewName: "bundle_view",
    _apiUrl: QUEUE_MODULE_URL,
    mixins: [ViewStoreMixin],
    init: function() {
      
    },

    storeMethod: function() {
        
    }
});


/*var _items = {};
var startPos = 0;
var endPos = 0;
var rowCount = 0;

function _addItems(json) {
  var pos = 0;
  _items = json.reduce(function(newViewItems, rawItem) {
    var viewItem;
    if (rawItem == null) {
      viewItem = this._items.indexOf(pos);
    } else {
      viewItem = _items[rawItem.token];
      if (viewItem == undefined) {
        viewItem = {
          token: rawItem.token
        };
      }

      if (rawItem.properties != undefined) {
        _addProperties(viewItem, rawItem.properties);
      }
    }

    newViewItems[viewItem.token] = viewItem;
    pos++;

    return newViewItems;
  });
}

function _addProperties(item, properties) {
  Object.keys(properties).forEach(function(propertyKey) {
    item[propertyKey] = properties[propertyKey];
  });
}

function _handleUpdate(obj) {
  if(obj.rangeStart != undefined) {
    this.rangeStart = obj.rangeStart;
  }

  if (obj.rangeEnd != undefined) {
    this.rangeEnd = obj.rangeEnd;
  }

  if (obj.row_count != undefined) {
    this.row_count = obj.row_count;
  }

  if (obj.items != undefined) {
    _addItems(items);
  }
}

class QueueStore extends BaseStore {
  constructor() {
    super();
    this.subscribe(() => this._registerToActions.bind(this))
  }

  get bundles() {
    return _bundles;
  }

  _registerToActions(action) {
    switch(action.actionType) {
      case BUNDLE_ADDED:
        this.emitChange();
        break;
      case BUNDLE_REMOVED:
        this.emitChange();
        break;
      case BUNDLE_UPDATED:
        this.emitChange();
        break;
      case BUNDLES_GET:
        _addBundles(action.bundles);
        this.emitChange();
        break;
      default:
        break;
    };
  }
}

export default new QueueStore();*/
