import React from 'react';

import LayoutHeader from 'components/semantic/LayoutHeader';
import ActionButton from 'components/ActionButton';


const SideMenuLayout = React.createClass({
	propTypes: {
		/**
		 * Location object
		 */
		location: React.PropTypes.object.isRequired,
	},

	render() {
		const { activeItem, menuItems, 
			itemIcon, itemHeader, itemDescriptionGetter
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
						<LayoutHeader
							className="session-header"
							icon={ itemIcon }
							title={ <div className="title">{ itemHeader }</div> }
							subHeader={ itemDescriptionGetter(activeItem) }
							/*component={ 
								<ActionButton 
									action={ this.props.closeAction } 
									args={ [ activeItem ] }
									icon={ false }
								/>
							}*/
						/>) : null }
						{ activeItem ? <div className="ui divider"/> : null }
						{ this.props.children }
					</div>
				</div>
			</div>
	);
	}
});

export default SideMenuLayout;
