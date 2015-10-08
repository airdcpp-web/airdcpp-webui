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
     * Function receiving an item object that returns the item ID
     */
    idGetter: React.PropTypes.func.isRequired,

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
  },
  
  displayName: "TabLayout",
  componentDidUpdate() {

  },

  getUrl(cid) {
  	return this.props.itemUrl + "/" + cid;
  },

  redirectTo(cid) {
  	History.replaceSidebar(this.props.location, this.getUrl(cid));
  },

  hasParams() {
  	return Object.keys(this.props.params).length > 0;
  },

  getCurrentId() {
  	return this.props.params[Object.keys(this.props.params)[0]];
  },

  saveLocation() {
  	localStorage.setItem(this.props.baseUrl + "_last_active", this.getCurrentId());
  },

  findItem(items, id) {
  	return items.find(item => this.props.idGetter(item) === id)
  },

  componentWillReceiveProps(nextProps) {
  	if (Object.keys(nextProps.params).length === 0) {
  		return;
  	}

  	// All items removed?
  	if (nextProps.items.length === 0) {
  		History.replaceSidebar(this.props.location, this.props.baseUrl);
  		return;
  	}

  	const currentId = this.getCurrentId();
  	if (nextProps.params[Object.keys(nextProps.params)[0]] !== currentId) {
  		return;
  	}

  	// Check if the current item still exists
	const item = this.findItem(nextProps.items, currentId);
    if (item) {
  	  return false;
    }

    // Find the old position
  	const oldItem = this.findItem(this.props.items, currentId);
  	const oldPos = this.props.items.indexOf(oldItem);

  	let newItemPos = oldPos;
  	if (oldPos === this.props.items.length-1) {
  	  // The last item was removed
  	  newItemPos = oldPos-1;
  	}

	this.redirectTo(this.props.idGetter(nextProps.items[newItemPos]));
  },

  componentDidUpdate() {
  	if (this.hasParams()) {
  	  this.saveLocation();
  	}
  },

  componentDidMount() {
  	if (this.hasParams()) {
  		// Loading an item already
  		this.saveLocation();
  		return;
  	}

  	let lastId = localStorage.getItem(this.props.baseUrl + "_last_active");
  	if (lastId && this.findItem(this.props.items, lastId)) {
  		this.redirectTo(lastId);
  	} else if (this.props.items.length > 0) {
  		this.redirectTo(this.props.items[0].user.cid);
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
      const id = this.props.idGetter(item);
      return (
        <MenuItem key={ id } 
          url={this.getUrl(id)}
          title={this.getItemContent(item)}
          location={this.props.location}/>
      );
    }, this);

    menuItems.unshift(<NewButton key="new-button" title="New session" location={this.props.location} baseUrl={this.props.baseUrl}/>);

    return (
	    <div className="ui grid">
	      <div className="four wide column">
	        <div className="ui vertical fluid tabular menu">
	          { menuItems }
	        </div>
	      </div>
	      <div className="twelve wide stretched column">
	        <div className="ui segment">
	          { this.props.children }
	        </div>
	      </div>
	    </div>
	);
  }
});

export default TabLayout