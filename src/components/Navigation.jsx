'use strict';

import React from 'react';
import LoginActions from 'actions/LoginActions';
import { IndexLink, Link } from 'react-router';

const logo = require('../../images/AirDCPlusPlus.png');


function MenuItem(props) {
	return (
		<Link to={props.page} className="item" activeClassName="active">
			{props.title}
		</Link>
	);
}

export default class Navigation extends React.Component {
	constructor() {
		super();
	}

	static contextTypes = {
		history: React.PropTypes.object.isRequired
	}
	
	render() {
		return (
			<div className="ui fixed inverted menu">
				<div className="ui container">
					<div href="#" className="header item">
						<img className="logo" src={ logo }/>
					</div>
					<div className="item right">
						<IndexLink className="item" to="/" activeClassName="active">
							Home
						</IndexLink>
						<MenuItem title="Favorites" page="/favorite-hubs"/>
						<MenuItem title="Queue" page="/queue"/>
						<MenuItem title="Search" page="/search"/>
						<a className="item" href="" onClick={this.logout}>
							Logout
						</a>
					</div>
				</div>
			</div>
		);
	}

	logout(e) {
		e.preventDefault();
		LoginActions.logout();
	}
}
