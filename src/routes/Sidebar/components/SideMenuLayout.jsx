import React from 'react';

import LayoutHeader from 'components/semantic/LayoutHeader';


const SideMenuLayout = ({ 
			activeItem, sessionMenuItems, newButton,
			itemIcon, itemHeader, children,
			itemDescriptionGetter,
	}) => {

	if (newButton) {
		newButton = React.cloneElement(newButton, { 
			className: newButton.props.className + ' ui fluid button' 
		});
	}

	return (
		<div className="ui grid session-container horizontal">
			<div className="four wide column menu-column">
				{ newButton }
				{ (sessionMenuItems.length ? 
					<div className="ui vertical secondary menu">
						{ sessionMenuItems}
					</div> : null)
				}
			</div>
			<div className="twelve wide stretched column content-column session">
				<div className="ui segment session-layout">
					{ activeItem ? (
						<LayoutHeader
							className="session-header"
							icon={ itemIcon }
							title={ <div className="title">{ itemHeader }</div> }
							subHeader={ itemDescriptionGetter(activeItem) }
						/>
					) : null }
					{ activeItem ? <div className="ui divider"/> : null }
					{ children }
				</div>
			</div>
		</div>
	);
};

SideMenuLayout.propTypes = {
	activeItem: React.PropTypes.object,
	newButton: React.PropTypes.node,
	itemIcon: React.PropTypes.node,
	itemHeader: React.PropTypes.node,
	sessionMenuItems: React.PropTypes.array.isRequired,
	itemDescriptionGetter: React.PropTypes.func.isRequired,
};

export default SideMenuLayout;
