import Reflux from 'reflux';
import SocketStore from '../stores/SocketStore'

export default {
	init() {
		this._items = [];
		this._startPos = 0;
		this._endPos = 0;
		this._rowCount = 0;

		SocketStore.addMessageListener(this._viewName + "_updated", this._handleUpdate);
	},

	uninit() {
		SocketStore.removeMessageListener(this._viewName + "_updated", this._handleUpdate);
	},

	clear() {
		this._items = [];
	},

	get items() {
		return this._items;
	},
	get viewUrl() {
		return this._apiUrl + "/" + this._viewName;
	},
	get viewName() {
		return this._viewName;
	},
	get rowCount() {
		return this._rowCount;
	},
	_addItems(itemsObj) {
	  let pos = 0;
	  this._items = itemsObj.reduce((newViewItems, rawItem) => {
	    let viewItem;
	    if (rawItem == null) {
	      viewItem = this._items[this._startPos + pos];
	    } else {
	      // Either a new item, existing one in a different position or we are updating properties
	      viewItem = this._findItem(rawItem.id);
	      if (viewItem == undefined) {
	        viewItem = {
	          id: rawItem.id
	        };
	      }

	      if (rawItem.properties != undefined) {
	        this._addProperties(viewItem, rawItem.properties);
	      } else if (Object.keys(viewItem).length == 1) {
	      	console.error("No properties were sent to an added view item", viewItem.id);
	      }
	    }

	    newViewItems[this._startPos + pos] = viewItem;
	    pos++;

	    return newViewItems;
	  }.bind(this), []);
	},

	_findItem(id) {
		return this._items.find(value => value.token == token);
		/*for (let i of this._items) {
	    	if (i.token == token) {
	    		return i;
	    	}
	   	}

		for (let i in this._items) {
	    	if (this._items[i].id == id) {
	    		return this._items[i];
	    	}
	   	}

	   	return undefined;*/
	},

	_addProperties(item, properties) {
	  Object.keys(properties).forEach((propertyKey) => {
	    item[propertyKey] = properties[propertyKey];
	  });
	},

	_handleUpdate(obj) {
	  if(obj.range_start != undefined) {
	    this._startPos = obj.range_start;
	  }

	  if (obj.range_end != undefined) {
	    this._endPos = obj.range_end;
	  }

	  if (obj.row_count != undefined) {
	    this._rowCount = obj.row_count;
	  }

	  if (obj.items != undefined) {
	    this._addItems(obj.items);
	  }

	  this.trigger(this._items);
	}
};