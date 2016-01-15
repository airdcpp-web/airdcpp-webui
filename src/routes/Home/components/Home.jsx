import React from 'react';

import DemoIntro from './DemoIntro';
import NewUserIntro from './NewUserIntro';

import '../style.css';


const Home = React.createClass({
	// TODO: add real content
	render() {
		return (
			<div id="home">
				<DemoIntro/>
				<NewUserIntro/>
			</div>
		);
	}
});

export default Home;