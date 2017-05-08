import SocketService from 'services/SocketService';
import TableActions from 'actions/TableActions';

import invariant from 'invariant';


// TODO: this should be handled on component level (instead of using global stores)
export default (defaultSortProperty, defaultSortAscending = true) => {
	let active = false;
	let totalCount = -1; // Not zero to avoid using emptyRowsNodeGetter when it's not wanted
	let matchingCount = 0;
	let startPos = 0;
	let items = [];
	let entityId = null;
	let paused = false;

	let sortProperty = defaultSortProperty;
	let sortAscending = defaultSortAscending;

	const findItem = (id) => {
		return items.find(item => !item ? false : item.id === id );
	};

	const clear = () => {
		items = [];
		startPos = 0;
		matchingCount = 0;
		totalCount = -1;
	};

	const addItems = (itemsObj) => {
		items = itemsObj.reduce((newViewItems, rawItem, index) => {
			// Either a new item, existing one in a different position or we are updating properties
			let viewItem = findItem(rawItem.id) || { id: rawItem.id };

			if (rawItem.properties) {
				viewItem = Object.assign({}, viewItem, rawItem.properties);
			} else if (Object.keys(viewItem).length === 1) {
				console.error('No properties were sent for a new view item', viewItem.id);
			}

			newViewItems[startPos + index] = viewItem;

			return newViewItems;
		}, []);
	};

	const parseDataProperties = (data) => {
		if (data.range_start != undefined) {
			startPos = data.range_start;
		}

		if (data.total_items != undefined) {
			totalCount = data.total_items;
		}

		if (data.matching_items != undefined) {
			matchingCount = data.matching_items;
		}

		if (data.items != undefined) {
			addItems(data.items);
		}
	};

	const ViewStoreMixin = {
		listenables: TableActions,

		onClose(viewUrl) {
			if (viewUrl !== this.viewUrl) {
				return;
			}

			this._removeMessageListener();
			clear();

			active = false;
			this.trigger();
		},

		onClear(viewUrl) {
			if (viewUrl !== this.viewUrl) {
				return;
			}

			clear();
			this.trigger();
		},

		onPause(viewUrl, enabled) {
			if (viewUrl !== this.viewUrl) {
				return;
			}

			paused = enabled;
		},

		onInit(viewUrl, entity) {
			if (viewUrl !== this.viewUrl) {
				return;
			}

			invariant(!active, 'Trying start an active table view');

			entityId = entity;

			this.addMessageListener();
			active = true;
		},

		onSetSort(viewUrl, property, ascending) {
			if (viewUrl !== this.viewUrl) {
				return;
			}

			sortProperty = property;
			sortAscending = ascending;
			//this.trigger(items);
		},

		addMessageListener() {
			this._removeMessageListener = SocketService.addViewUpdateListener(this._viewName, this._handleUpdate, entityId);
		},

		get items() {
			return items;
		},

		get viewUrl() {
			let viewUrl = this._apiUrl + '/';
			if (entityId) {
				viewUrl += entityId + '/';
			}

			viewUrl += this._viewName;
			return viewUrl;
		},

		get viewName() {
			return viewName;
		},

		get rowCount() {
			return matchingCount;
		},

		get totalCount() {
			return totalCount;
		},

		get active() {
			return active;
		},

		get sortProperty() {
			return sortProperty;
		},

		get sortAscending() {
			return sortAscending;
		},

		get paused() {
			return paused;
		},

		_handleUpdate(data) {
			parseDataProperties(data);
			this.trigger(items, data.range_offset, matchingCount);
		}
	};

	return ViewStoreMixin;
};
