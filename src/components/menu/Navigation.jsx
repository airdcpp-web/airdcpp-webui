'use strict';

import React from 'react';
import LoginActions from 'actions/LoginActions';
import { IndexLink, Link } from 'react-router';

import Logo from '../../../images/AirDCPlusPlus.png';


function MenuItem(props) {
	return (
		<Link to={props.url} className="item" activeClassName="active">
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
			<div>
				<div className="ui fixed inverted menu">
					<div className="ui container">
						<div href="#" className="header item">
							<img className="logo" src={ Logo }/>
						</div>
						<div className="item right">
							<IndexLink className="item" to="/" activeClassName="active">
								Home
							</IndexLink>
							<MenuItem title="Favorites" url="/favorite-hubs"/>
							<MenuItem title="Queue" url="/queue"/>
							<MenuItem title="Search" url="/search"/>
							<MenuItem title="Settings" url="/settings"/>
							<a className="item" href="" onClick={this.logout}>
								Logout
							</a>
						</div>
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
