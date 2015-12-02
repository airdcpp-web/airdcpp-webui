import SocketService from 'services/SocketService';
import update from 'react-addons-update';

//import deepEqual from 'deep-equal';

// This will handle fetching only when scrolling. Otherwise the data will be updated through the socket listener.
class RowDataLoader {
	constructor(store, onDataLoad) {
		this._onDataLoad = onDataLoad;
		this._store = store;
		this._data = [];
		this._pendingRequest = {};
		this._initialDataReceived = false;
	}

	onItemsUpdated(items, rangeOffset) {
		this._initialDataReceived = true;

		let hasChanges = false;
		items.forEach((obj, index) => {
			let old = this._data[index];

			// Objects equal most of the time
			// TODO: causes delay during initial loading
			//if (old === obj || deepEqual(this._data[index], obj)) {
			//	return;
			//}

			if (old) {
				this._data[index] = update(old, { $merge: obj });
			} else {
				this._data[index] = update(old, { $set: obj });
			}

			hasChanges = true;
		}, this);

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
			
			return;
		}
		
		onDataLoaded(rowData);
	}

	_queueRequestFor(rowIndex, onDataLoaded) {
		const request = this._pendingRequest[rowIndex];
		if (request) {
			request.push(onDataLoaded);
			return;
		}

		this._pendingRequest[rowIndex] = [ onDataLoaded ];
		SocketService.get(this._store.viewUrl + '/items/' + rowIndex + '/' + (rowIndex+1))
			.then(rows => {
				this._data[rowIndex] = rows[0];
				this._pendingRequest[rowIndex].forEach(f => f(rows[0]));
				delete this._pendingRequest[rowIndex];
			}.bind(this))
			.catch(error => {
				console.log('Failed to load data', error);
				delete this._pendingRequest[rowIndex];
			}
		);
	}
}

export default RowDataLoader;