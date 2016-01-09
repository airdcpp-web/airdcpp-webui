import React from 'react';

import Message from 'components/semantic/Message';


const WelcomeMessage = () => {
	if (process.env.DEMO_MODE !== '1') {
		return <span/>;
	}

	return (
			<Message 
				title="Welcome to AirDC++ Web Demo"
				description={ (
					<div className="demo-message" style={{ marginTop: '15px' }}>
						<p>
							Edit permissions are limited to keep the content somewhat persistent.
						</p>
						<p>
							Note that this is a locally installed application that is usually run by a single user. 
							Most changes, such as browsing of filelists, are propagated to all active sessions.
						</p>
						<p>
							Please visit the <a href="https://github.com/maksis/airdcpp-webclient" target="_blank">home page</a> for more information about the client and its features.
						</p>
					</div>
				) }
			/>
	);
};

const Home = React.createClass({
	// TODO: add real content
	render() {
		return (
			<div id="home">
				<WelcomeMessage/>
			</div>
		);
	}
});

export default Home;