import React from 'react';

import TabHeader from 'routes/Sidebar/components/TabHeader';


const SideMenuLayout = React.createClass({
	propTypes: {
		/**
		 * Location object
		 */
		location: React.PropTypes.object.isRequired,
	},

	render() {
		const { activeItem, menuItems, 
			itemIconGetter, itemHeaderGetter, itemDescriptionGetter, 
			actionMenu, location 
		} = this.props;

		const newButton = this.props.newButton ? React.cloneElement(this.props.newButton, { 
			className: this.props.newButton.props.className + 'ui fluid button' 
		}) : null;

		return (
			<div className="ui grid session-container horizontal">
				<div className="four wide column menu-column">
					{ newButton }
					{ (menuItems.length ? 
						<div className="ui vertical secondary menu">
							{ menuItems }
						</div> : null)
					}
				</div>
				<div className="twelve wide stretched column content-column session">
					<div className="ui segment session-layout">
						{ activeItem ? (
						<TabHeader
							icon={ itemIconGetter(activeItem) }
							title={ itemHeaderGetter(activeItem, location, actionMenu) }
							//buttonClickHandler={ () => this.props.newButton }
							//buttonCaption="User list"
							subHeader={ itemDescriptionGetter(activeItem) }
						/>) : null }
						<div className="ui divider"/>
						{ this.props.children }
					</div>
				</div>
			</div>
	);
	}
});

export default SideMenuLayout;
