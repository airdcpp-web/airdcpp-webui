import SocketService from 'services/SocketService';
import update from 'react-addons-update';

// This will handle fetching only when scrolling. Otherwise the data will be updated through the socket listener.
class RowDataLoader {
	constructor(store, onDataLoad) {
		this._onDataLoad = onDataLoad;
		this._store = store;
		this._data = [];
		this._pendingRequest = {};
	}

	onItemsUpdated(items, rangeOffset) {
		items.forEach((obj, index) => {
			let old = this._data[index];
			if (this._data[index]) {
				this._data[index] = update(old, { $merge: obj });
			} else {
				this._data[index] = update(old, { $set: obj });
			}
		}, this);

		this._onDataLoad();
	}

	get rangeOffset() {
		const ret = this._rangeOffset;
		this._rangeOffset = 0;
		return ret;
	}
	
	getRowData(rowIndex, onDataLoaded) {
		if (!this._data[rowIndex]) {
			this._queueRequestFor(rowIndex, onDataLoaded);
			return undefined;
		}
		
		return this._data[rowIndex];
	}

	_queueRequestFor(rowIndex, onDataLoaded) {
		const request = this._pendingRequest[rowIndex];
		if (request) {
			request.push(onDataLoaded);
			return;
		}

		this._pendingRequest[rowIndex] = [ onDataLoaded ];
		SocketService.get(this._store.viewUrl + '/items/' + rowIndex + '/' + (rowIndex+1))
			.then(row => {
				this._data[rowIndex] = row[0];
				this._pendingRequest[rowIndex].forEach(f => f());
				delete this._pendingRequest[rowIndex];
			}.bind(this))
			.catch(error => {
				console.log('Failed to load data: ' + error, this.props.viewName);
				delete this._pendingRequest[rowIndex];
			}
		);
	}
}

export default RowDataLoader;