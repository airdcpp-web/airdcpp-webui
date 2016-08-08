import React from 'react';

//import ActionButton from 'components/ActionButton';
import LayoutHeader from 'components/semantic/LayoutHeader';


const SideMenuLayout = ({ 
			activeItem, sessions, newButton,
			itemIcon, itemHeader, children,
			sessionMenuItemGetter,
			itemDescriptionGetter,
	}) => {

	if (newButton) {
		newButton = React.cloneElement(newButton, { 
			className: newButton.props.className + 'ui fluid button' 
		});
	}

	return (
		<div className="ui grid session-container horizontal">
			<div className="four wide column menu-column">
				{ newButton }
				{ (sessions.length ? 
					<div className="ui vertical secondary menu">
						{ sessions.map(sessionMenuItemGetter) }
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
						/*component={ 
							<ActionButton 
								className="small basic"
								action={ closeAction } 
								itemData={ activeItem }
								icon={ false }
								//icon="gray remove"
							/>
						}*/
					/>) : null }
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
	sessionMenuItemGetter: React.PropTypes.func.isRequired,
	sessions: React.PropTypes.array.isRequired,
	itemDescriptionGetter: React.PropTypes.func.isRequired,
	//closeAction: React.PropTypes.func.isRequired,
};

export default SideMenuLayout;
