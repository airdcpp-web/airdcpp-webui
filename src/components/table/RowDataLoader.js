import SocketService from 'services/SocketService';
import update from 'react-addons-update';

//const NUMBER_OF_ROWS_PER_REQUEST = 10;

// This will handle fetching only when scrolling. Otherwise the data will be updated through the socket listener.
class RowDataLoader {
	constructor(store, onDataLoad) {
		this._onDataLoad = onDataLoad;
		this._store = store;
		//this._requestQueue = [];
		this._data = [];
		this._pendingRequest = {};
		//this._fetchingActive = false;
		//this._rangeOffset = 0;
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
		//this._rangeOffset = rangeOffset;
	}

	//set onDataLoad(handler) {
	//	this._onDataLoad = handler;
	//}

	get rangeOffset() {
		const ret = this._rangeOffset;
		this._rangeOffset = 0;
		return ret;
	}

	//set fetchingActive(value) {
	//	this._fetchingActive = value;
	//}
	
	getRowData(rowIndex, onDataLoaded) {
		if (!this._data[rowIndex]) {
			this._queueRequestFor(rowIndex, onDataLoaded);
			
			//if (this._fetchingActive) {
			//	this._queueRequestFor(rowIndex, onDataLoaded);
			//}
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
				//this._removeRequest(rowStart, rowEnd, false);
				console.log('Failed to load data: ' + error, this.props.viewName);
				delete this._pendingRequest[rowIndex];
			}
		);
	}

	/*_hasPendingRequest(rowIndex) {
		const index = Object.keys(this._pendingRequest).find((startRow) => {
			return startRow <= rowIndex && startRow + NUMBER_OF_ROWS_PER_REQUEST >= rowIndex;
		});

		return index;
	}

	_removeRequest(startRow, endRow, succeed) {
		//const index = this._pendingRequest.indexOf(startRow);
		//this._pendingRequest.splice(index, 1);
		//this._pendingRequest[startRow]();

		for (let i=startRow; i < endRow; i++) {
			if (this._pendingRequest[i]) {
				if (succeed) {
					this._pendingRequest[i]();
				}
				
				delete this._pendingRequest[i];
			}
		}

		//delete this._pendingRequest[startRow];
	}
	
	_queueRequestFor(rowIndex, onDataLoaded) {
		if (this._hasPendingRequest(rowIndex)) {
			this._pendingRequest[rowIndex] = onDataLoaded;
			return;
		}

		this._pendingRequest[rowIndex] = onDataLoaded;

		this._requestQueue.push(rowIndex);
		
		if (!this._queueFlushID) {
			this._queueFlushID = setTimeout(this._flushRequestQueue.bind(this), 0);
		}
	}
	
	_flushRequestQueue() {
		const sectionsToLoad = this._requestQueue.reduce((requestSections, rowIndex) => {
			const rowBase = rowIndex - (rowIndex % NUMBER_OF_ROWS_PER_REQUEST);
			if (requestSections.indexOf(rowBase) === -1) {
				return requestSections.concat(rowBase);
			}
			
			return requestSections;
		}, []);
		
		sectionsToLoad.forEach(rowBase => {
			this._loadDataRange(
				rowBase,
				Math.min(rowBase + NUMBER_OF_ROWS_PER_REQUEST, this._store.rowCount)
			);		
		}, this);
		
		this._requestQueue = [];
		this._queueFlushID = null;
	}
		
	_loadDataRange(rowStart, rowEnd) {
		//this._pendingRequest.push(rowStart);
		SocketService.get(this._store.viewUrl + '/items/' + rowStart + '/' + rowEnd)
			.then(data => {
				this._removeRequest(rowStart, rowEnd, true);
				for (let i=0; i < data.length; i++) {
					 this._data[rowStart+i] = data[i];
				}

				//this._onDataLoad();
			}.bind(this))
			.catch(error => {
				this._removeRequest(rowStart, rowEnd, false);
				console.log('Failed to load data: ' + error, this.props.viewName);
			}
			);
	}*/
}

export default RowDataLoader;