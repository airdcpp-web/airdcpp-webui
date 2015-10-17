import React from 'react';

import SocketStore from 'stores/SocketStore'

export default function(Component) {
	//items = [];
	let startPos = 0;
	let endPos = 0;
	let rowCount = 0;
	let removeMessageListener = null;

	const DataSource = React.createClass({
	  propTypes: {
	    /**
	     * Name of the view (such as "bundle_view")
	     */
	  	viewName: React.PropTypes.string.isRequired,

	    /**
	     * Module URL (such as "bundle_view")
	     */
    	viewBaseUrl: React.PropTypes.string.isRequired,

	    /**
	     * Possible entity ID that can be converted to string (such as CID or numeric ID) 
	     */
    	entityId: React.PropTypes.any,
	  },

		getInitialState() {
			return {
				items: [],
				startPos: 0,
				endPos: 0,
				rowCount: 0
			}
		},

		componentWillReceiveProps(nextProps) {
	      if (nextProps.entityId !== this.props.entityId) {
	      	this.removeListener(this.props.entityId);
	      	this.addListener(nextProps.entityId);

	      	this.setState({items : []});
	      }
	    },

	    componentWillMount() {
	    	this.addListener(this.props.entityId);
	    },

	   	componentWillUnmount() {
	   		this.removeListener(this.props.entityId);
	    },

		addListener(id) {
			removeMessageListener = SocketStore.addMessageListener(this.props.viewName + "_updated", this._handleUpdate, id);
		},

		removeListener(id) {
			removeMessageListener();
			//SocketStore.removeMessageListener(this.props.viewName + "_updated", this._handleUpdate, id);
		},

		/*clear() {
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
		},*/

		_addItems(itemsObj) {
		  //let pos = 0;
		  const items = itemsObj.reduce((newViewItems, rawItem, index) => {
			// Either a new item, existing one in a different position or we are updating properties
			let viewItem = this._findItem(rawItem.id) || { id: rawItem.id };

			if (rawItem.properties) {
				Object.assign(viewItem, rawItem.properties);
			} else if (Object.keys(viewItem).length == 1) {
				console.error("No properties were sent for a new view item", viewItem.id);
			}

			newViewItems[startPos + index] = viewItem;

			return newViewItems;
		  }.bind(this), []);

		  this.setState({items: items})
		},

		_findItem(id) {
			return this.state.items.find(item => !item ? false : item.id === id );
		},

		_handleUpdate(obj) {
		  if(obj.range_start != undefined) {
		    startPos = obj.range_start;
		  }

		  if (obj.range_end != undefined) {
		    endPos = obj.range_end;
		  }

		  if (obj.row_count != undefined) {
		    rowCount = obj.row_count;
		  }

		  if (obj.items != undefined) {
		    this._addItems(obj.items);
		  }
		},

	    render() {
	      /*if (!this.props.item) {
	        return <div className="ui text loader">Loading</div>
	      }*/

	      const url = this.props.viewUrl;
	      return <Component {...this.props} {...this.state} viewUrl={this.props.viewBaseUrl + '/' + this.props.viewName } rowCount={rowCount}/>
	    },
	});

	return DataSource;
}

