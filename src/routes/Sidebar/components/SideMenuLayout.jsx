import React from 'react';

import LayoutHeader from 'components/semantic/LayoutHeader';


const SideMenuLayout = ({ 
		sessionMenuItems, newButton,
		itemHeaderIcon, itemHeaderTitle, children,
		itemHeaderDescription,
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
					<LayoutHeader
						className="session-header"
						icon={ itemHeaderIcon }
						title={ <div className="title">{ itemHeaderTitle }</div> }
						subHeader={ itemHeaderDescription }
					/>
					<div className="ui divider"/>
					{ children }
				</div>
			</div>
		</div>
	);
};

SideMenuLayout.propTypes = {
	newButton: React.PropTypes.node,
	sessionMenuItems: React.PropTypes.array.isRequired,

	itemHeaderTitle: React.PropTypes.node,
	itemHeaderIcon: React.PropTypes.node,
	itemHeaderDescription: React.PropTypes.func.isRequired,
};

export default SideMenuLayout;
