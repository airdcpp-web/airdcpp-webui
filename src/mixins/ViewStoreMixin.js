import SocketStore from 'stores/SocketStore';

export default {
	init(entityId) {
		this._items = [];
		this._startPos = 0;
		this._rowCount = 0;
		this._entityId = entityId;

		this.addListener();
	},

	uninit() {
		this._removeMessageListener();
	},

	clear() {
		this._items = [];
		this._startPos = 0;
		this._rowCount = 0;
		this._items = [];
	},

	setEntityId(entityId) {
		this._entityId = entityId;
		this._removeMessageListener();
		this.addListener();
	},

	addListener() {
		this._removeMessageListener = SocketStore.addMessageListener(this._viewName + '_updated', this._handleUpdate, this._entityId);
	},

	get items() {
		return this._items;
	},

	get viewUrl() {
		let viewUrl = this._apiUrl + '/';
		if (this._entityId) {
			viewUrl += this._entityId + '/';
		}

		viewUrl += this._viewName;
		return viewUrl;
	},

	get viewName() {
		return this._viewName;
	},

	get rowCount() {
		return this._rowCount;
	},

	_addItems(itemsObj) {
		this._items = itemsObj.reduce((newViewItems, rawItem, index) => {
			// Either a new item, existing one in a different position or we are updating properties
			let viewItem = this._findItem(rawItem.id) || { id: rawItem.id };

			if (rawItem.properties) {
				Object.assign(viewItem, rawItem.properties);
			} else if (Object.keys(viewItem).length == 1) {
				console.error('No properties were sent for a new view item', viewItem.id);
			}

			newViewItems[this._startPos + index] = viewItem;

			return newViewItems;
		}.bind(this), []);
	},

	_findItem(id) {
		return this._items.find(item => !item ? false : item.id === id );
	},

	_handleUpdate(obj) {
		if (obj.range_start != undefined) {
			this._startPos = obj.range_start;
		}

		if (obj.total_items != undefined) {
			this._rowCount = obj.total_items;
		}

		if (obj.items != undefined) {
			this._addItems(obj.items);
		}

		this.trigger(this._items);
	}
};
