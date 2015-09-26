import Reflux from 'reflux';
import SocketStore from 'stores/SocketStore'

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
	  //let pos = 0;
	  this._items = itemsObj.reduce((newViewItems, rawItem, index) => {
		// Either a new item, existing one in a different position or we are updating properties
		let viewItem = this._findItem(rawItem.id) || { id: rawItem.id };

		if (rawItem.properties) {
			Object.assign(viewItem, rawItem.properties);
		} else if (Object.keys(viewItem).length == 1) {
			console.error("No properties were sent for a new view item", viewItem.id);
		}

		newViewItems[this._startPos + index] = viewItem;

		return newViewItems;
	  }.bind(this), []);
	},

	_findItem(id) {
		return this._items.find(item => !item ? false : item.id === id );
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