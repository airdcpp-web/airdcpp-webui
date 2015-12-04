'use strict';
import React from 'react';
import Logo from '../../images/AirDCPlusPlus.png';

const SiteHeader = React.createClass({
	render() {
		return (
			<div className="ui fixed inverted menu site-header">
				<div className="ui container">
					<div href="#" className="header item">
						<img className="logo" src={ Logo }/>
					</div>
					{ this.props.content }
				</div>
			</div>
		);
	},
});

export default SiteHeader;
