import React from 'react';

import { Link } from 'react-router';

import History from 'utils/History'


const MenuItem = React.createClass({
  propTypes: {
    /**
     * Location object
     */
    location: React.PropTypes.object.isRequired,

    /**
     * Item URL
     */
    url: React.PropTypes.string.isRequired,

    /**
     * Title of the button
     */
    title: React.PropTypes.any.isRequired,
  },

  displayName: "MenuItem",
  onClick: function(evt) {
    evt.preventDefault();

    History.pushSidebar(this.props.location, this.props.url);
  },

  render: function() {
    return (
      <Link to={this.props.url} className="item tab-layout" onClick={this.onClick}>

        {this.props.title}
      </Link>
    );
  }
});

const NewButton = React.createClass({
  propTypes: {
    /**
     * Location object
     */
    location: React.PropTypes.object.isRequired,

    /**
     * Base URL of the section
     */
    baseUrl: React.PropTypes.string.isRequired,

    /**
     * Title of the button
     */
    title: React.PropTypes.node.isRequired,
  },

  displayName: "NewButton",
  onClick: function(evt) {
    evt.preventDefault();

    History.pushSidebar(this.props.location, this.props.baseUrl);
  },

  render: function() {
    return (
      <Link to={this.props.baseUrl} className="item button-new" onClick={this.onClick}>
        <div className="ui fluid button">
        <i className="plus icon"></i>
        {this.props.title}
        </div>
      </Link>
    );
  }
});

const TabLayout = React.createClass({
  propTypes: {
    /**
     * Unique ID of the section (used for storing and loading the previously open tab)
     */
    baseUrl: React.PropTypes.string.isRequired,

    /**
     * Location object
     */
    location: React.PropTypes.object.isRequired,

    /**
     * Item URL
     */
    itemUrl: React.PropTypes.string.isRequired,

    /**
     * Array of the items to list
     */
    items: React.PropTypes.array.isRequired,

    /**
     * Function receiving an item object that returns the display name
     */
    nameGetter: React.PropTypes.func.isRequired,

    /**
     * Function receiving label after the name (unread count etc.)
     */
    labelGetter: React.PropTypes.func.isRequired,

    /**
     * Color of the label
     */
    labelColor: React.PropTypes.string.isRequired,

    /**
     * Function receiving the circular color label in front of the item
     */
    statusGetter: React.PropTypes.func.isRequired,

    /**
     * Item ID that is currently active (if any)
     */
    activeId: React.PropTypes.any,
  },
  
  displayName: "TabLayout",
  getInitialState() {
    return {
      activeItem: null
    };
  },

  componentDidUpdate() {

  },

  getUrl(id) {
  	return this.props.itemUrl + "/" + id;
  },

  redirectTo(id) {
  	History.replaceSidebar(this.props.location, this.getUrl(id));
  },

  saveLocation() {
  	localStorage.setItem(this.props.baseUrl + "_last_active", this.props.activeId);
  },

  findItem(items, id) {
  	return items.find(item => item.id === id)
  },

  componentWillReceiveProps(nextProps) {
  	if (!nextProps.activeId) {
  		return;
  	}

  	// All items removed?
  	if (nextProps.items.length === 0) {
  		History.replaceSidebar(this.props.location, this.props.baseUrl);
      this.setState({ activeItem: null });
  		return;
  	}

    // Update the active item
    const newActiveItem = this.findItem(nextProps.items, nextProps.activeId);
    if (newActiveItem) {
      this.setState({ activeItem: newActiveItem });
    }

    // After this, we only handle cases when the old tab has been closed
    const oldActiveId = this.props.activeId;
    if (nextProps.activeId !== oldActiveId) {
      // We have a new tab already
      return;
    }


  	// Check if the current item still exists in the list
    if (this.findItem(nextProps.items, oldActiveId)) {
  	  return;
    }

    // Find the old position
  	const oldItem = this.findItem(this.props.items, oldActiveId);
  	const oldPos = this.props.items.indexOf(oldItem);

  	let newItemPos = oldPos;
  	if (oldPos === this.props.items.length-1) {
  	  // The last item was removed
  	  newItemPos = oldPos-1;
  	}

	 this.redirectTo(nextProps.items[newItemPos].id);
  },

  componentDidUpdate() {
  	if (this.props.activeId) {
  	  this.saveLocation();
  	}
  },

  componentDidMount() {
  	if (this.props.activeId) {
  		// Loading an item already
  		this.saveLocation();
  		return;
  	}

  	let lastId = localStorage.getItem(this.props.baseUrl + "_last_active");
  	if (lastId && this.findItem(this.props.items, lastId)) {
  		this.redirectTo(lastId);
  	} else if (this.props.items.length > 0) {
  		this.redirectTo(this.props.items[0].id);
  	}
  },

  getItemLabel(item) {
  	const label = this.props.labelGetter(item);
  	if (!label) {
  		return null;
  	}

  	return (<div className={ "ui mini right label " + this.props.labelColor}> { label } </div>)
  },

  getItemContent(item) {
  	return (
  		<div>
  			<div className={ "ui empty circular mini label " + this.props.statusGetter(item) }/>
	  		{ this.props.nameGetter(item) }
	  		{ this.getItemLabel(item) }
  		</div>
  	);
  },

  render() {
    const menuItems = this.props.items.map(item => {
      const id = item.id;
      return (
        <MenuItem key={ id } 
          url={this.getUrl(id)}
          title={this.getItemContent(item)}
          location={this.props.location}/>
      );
    }, this);

    //menuItems.unshift(<NewButton key="new-button" title="New session" location={this.props.location} baseUrl={this.props.baseUrl}/>);

    /*const children = React.Children.map(this.props.children, (child) => {
      let label = column.props.label + ((this.state.sortProperty === column.props.dataKey) ? sortDirArrow : '');
      let flexGrow = undefined;
      let width = undefined;
      if (this._columnWidths[column.props.dataKey] != undefined) {
        width = this._columnWidths[column.props.dataKey];
      } else {
        flexGrow = column.props.flexGrow;
        width = column.props.width;
      }

      return React.cloneElement(column, {
        headerRenderer: this._renderHeader,
        label: label,
        flexGrow: flexGrow,
        width: width,
        isResizable: true
      });
    }, this);*/

    return (
	    <div className="ui grid">
	      <div className="four wide column">
	        <div className="ui vertical fluid tabular menu">
            <NewButton key="new-button" title="New session" location={this.props.location} baseUrl={this.props.baseUrl}/>
	          { menuItems }
	        </div>
	      </div>
	      <div className="twelve wide stretched column">
	        <div className="ui segment">
	          { React.cloneElement(this.props.children, { item: this.state.activeItem }) }
	        </div>
	      </div>
	    </div>
	);
  }
});

export default TabLayout