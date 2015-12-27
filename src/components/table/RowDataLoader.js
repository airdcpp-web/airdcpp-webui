import SocketService from 'services/SocketService';
import update from 'react-addons-update';

import deepEqual from 'deep-equal';

const NUMBER_OF_ROWS_PER_REQUEST = 10;
const DEBUG = false;

// This will handle fetching only when scrolling. Otherwise the data will be updated through the socket listener.
class RowDataLoader {
	constructor(store, onDataLoad) {
		this._onDataLoad = onDataLoad;
		this._store = store;
		this._data = [];
		this._pendingRequest = {};
		this._initialDataReceived = false;
	}

	clear() {
		this._pendingRequest = {};
		this._data = [];
	}

	// Returns true if the item was updated
	updateItem(updated, item, index) {
		let old = this._data[index];

		// Objects equal most of the time
		if (old === item || deepEqual(this._data[index], item)) {
			return updated;
		}

		if (old) {
			this._data[index] = update(old, { $merge: item });
		} else {
			this._data[index] = update(old, { $set: item });
		}

		return updated + 1;
	}

	onItemsUpdated(items, rangeOffset = 0) {
		let hasChanges = false;
		//const oldData = this._data;
		if (!items || items.length === 0) {
			// The view was cleared
			this.clear();
			hasChanges = true;

			this._initialDataReceived = false;

			if (DEBUG) {
				console.log('onItemsUpdated, cleared');
			}
		} else {
			this._initialDataReceived = true;

			// Remove rows outside the range
			// Leave the current range in case all old items can be reused 
			// (avoids flickering because there is no need to re-render)
			for (let i = 0; i < this._data.length; i++) {
				if (!items[i]) {
					delete this._data[i];
				}
			}

			// Update rows
			const updatedCount = items.reduce(this.updateItem.bind(this), 0);
			if (updatedCount > 0 || rangeOffset !== 0) {
				if (DEBUG) {
					console.log('onItemsUpdated, changed (updatedCount, rangeOffset)', updatedCount, rangeOffset);
				}

				hasChanges = true;
			}
		}

		if (hasChanges) {
			this._onDataLoad();
		}
	}

	get rangeOffset() {
		const ret = this._rangeOffset;
		this._rangeOffset = 0;
		return ret;
	}
	
	getRowData(rowIndex) {
		return this._data[rowIndex];
	}

	// onDataLoaded is called when the data is ready
	updateRowData(rowIndex, onDataLoaded) {
		const rowData = this._data[rowIndex];
		if (!rowData) {
			if (this._initialDataReceived) {
				this._queueRequestFor(rowIndex, onDataLoaded);
			}
			
			return false;
		}

		onDataLoaded(rowData);
		return true;
	}

	_queueRequestFor(rowIndex, onDataLoaded) {
		const rowBase = rowIndex - (rowIndex % NUMBER_OF_ROWS_PER_REQUEST);

		const request = this._pendingRequest[rowIndex];
		if (request) {
			request.push(onDataLoaded);
			return;
		}

		this._pendingRequest[rowIndex] = [ onDataLoaded ];
		if (rowIndex !== rowBase) {
			if (this._pendingRequest[rowBase]) {
				return;
			}

			this._pendingRequest[rowBase] = [ ];
		}

		const endRow = Math.min(rowBase + NUMBER_OF_ROWS_PER_REQUEST, this._store.rowCount);
		SocketService.get(this._store.viewUrl + '/items/' + rowBase + '/' + endRow)
			.then(this.onRowsReceived.bind(this, rowBase))
			.catch(error => {
				console.error('Failed to load data', error);
				for (let i=rowBase; i < endRow; i++) {
					if (this._pendingRequest[i]) {
						delete this._pendingRequest[i];
					}
				}
			}
		);
	}

	onRowsReceived(start, rows) {
		if (!this._pendingRequest[start]) {
			// View changed
			return;
		}

		for (let i=0; i < rows.length; i++) {
			const rowIndex = start+i;
			if (!deepEqual(this._data[rowIndex], rows[i])) {
				this._data[rowIndex] = rows[i];

				if (this._pendingRequest[rowIndex]) {
					this._pendingRequest[rowIndex].forEach(f => f(rows[i]));
				}
			} else if (DEBUG) {
				console.log('onRowsReceived, row data equals', rowIndex);
			}

			delete this._pendingRequest[rowIndex];
		}
	}
}

export default RowDataLoader;