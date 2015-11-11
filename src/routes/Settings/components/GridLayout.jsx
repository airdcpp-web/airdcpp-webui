'use strict';

import React from 'react';
import MenuItemLink from 'components/semantic/MenuItemLink';

const GridLayout = React.createClass({
	sectionToUrl(section) {
		return '/settings/' + this.props.id + '/' + section;
	},

	getMenuItem(obj) {
		return <MenuItemLink key={ obj.url } url={ this.sectionToUrl(obj.url) } title={ obj.title }/>;
	},

	componentWillMount() {
		if (!this.props.children) {
			this.props.history.replaceState(null, this.sectionToUrl(this.props.menuItems[0].url));
		}
	},

	render() {
		return (
			<div className={ 'ui segment grid settings-grid-layout ' + this.props.id }>
				<div className="three wide column menu-column">
					<div className="ui vertical secondary menu">
						{ this.props.menuItems.map(this.getMenuItem) }
					</div>
				</div>
				<div className="thirteen wide stretched column content-column">
					<div className="ui segment settings-content-layout">
						{ this.props.children }
					</div>
				</div>
			</div>
		);
	},
});

export default GridLayout;
